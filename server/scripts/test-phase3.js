/* Ad-hoc Phase 3 verification: analytics engine.
   Run with the server up: node scripts/test-phase3.js */
const BASE = 'http://localhost:5000/api';

let pass = 0;
let fail = 0;
function check(name, cond, detail = '') {
  cond ? (pass++, console.log(`  PASS  ${name}`)) : (fail++, console.log(`  FAIL  ${name}  ${detail}`));
}
async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

(async () => {
  // Form with a number, two selects, and a multiselect.
  const create = await req('POST', '/forms', {
    title: 'Customer Feedback (phase3 test)',
    fields: [
      { label: 'Rating', type: 'number', required: true, min: 1, max: 5 },
      { label: 'Service', type: 'select', required: true, options: ['Support', 'Sales', 'Billing'] },
      { label: 'Recommend', type: 'select', required: true, options: ['Yes', 'No'] },
      { label: 'Channels', type: 'multiselect', required: false, options: ['Email', 'Phone', 'Chat'] },
    ],
  });
  const form = create.json.data;
  const id = {};
  form.fields.forEach((f) => (id[f.label] = f.id));
  const pid = form.publicId;
  const byLabel = (a, label) => a.fields.find((f) => f.label === label);

  // Empty-state analytics first.
  const empty = (await req('GET', `/forms/${pid}/analytics`)).json.data;
  check('empty: totalResponses 0', empty.totalResponses === 0, JSON.stringify(empty.totalResponses));
  check('empty: number average null', byLabel(empty, 'Rating').average === null);
  check('empty: select mostSelected null', byLabel(empty, 'Service').mostSelected === null);
  check('empty: distribution seeded with all options at 0',
    byLabel(empty, 'Service').distribution.length === 3 &&
      byLabel(empty, 'Service').distribution.every((d) => d.count === 0));

  // Seed 4 hand-computable responses.
  const data = [
    { Rating: 5, Service: 'Support', Recommend: 'Yes', Channels: ['Email', 'Phone'] },
    { Rating: 3, Service: 'Support', Recommend: 'Yes', Channels: ['Email'] },
    { Rating: 4, Service: 'Sales', Recommend: 'No', Channels: ['Chat', 'Email'] },
    { Rating: 1, Service: 'Billing', Recommend: 'No', Channels: ['Phone'] },
  ];
  for (const d of data) {
    const r = await req('POST', `/forms/${pid}/responses`, {
      answers: { [id.Rating]: d.Rating, [id.Service]: d.Service, [id.Recommend]: d.Recommend, [id.Channels]: d.Channels },
    });
    if (r.status !== 201) console.log('   submit failed', JSON.stringify(r.json));
  }

  const a = (await req('GET', `/forms/${pid}/analytics`)).json.data;

  check('totalResponses 4', a.totalResponses === 4, JSON.stringify(a.totalResponses));

  const rating = byLabel(a, 'Rating');
  check('Rating average 3.25', rating.average === 3.25, JSON.stringify(rating));
  check('Rating min 1 / max 5 / count 4', rating.min === 1 && rating.max === 5 && rating.count === 4);

  const service = byLabel(a, 'Service');
  const sCount = Object.fromEntries(service.distribution.map((d) => [d.option, d.count]));
  check('Service dist Support2/Sales1/Billing1', sCount.Support === 2 && sCount.Sales === 1 && sCount.Billing === 1,
    JSON.stringify(sCount));
  check('Service mostSelected Support', service.mostSelected === 'Support', service.mostSelected);
  check('Service distribution sorted desc', service.distribution[0].count >= service.distribution[1].count);

  const rec = byLabel(a, 'Recommend');
  check('Recommend tie -> mostSelected Yes (count 2)', rec.mostSelected === 'Yes', JSON.stringify(rec.distribution));

  const ch = byLabel(a, 'Channels');
  const cCount = Object.fromEntries(ch.distribution.map((d) => [d.option, d.count]));
  check('Channels dist Email3/Phone2/Chat1', cCount.Email === 3 && cCount.Phone === 2 && cCount.Chat === 1,
    JSON.stringify(cCount));
  check('Channels totalSelections 6', ch.totalSelections === 6, JSON.stringify(ch.totalSelections));
  check('Channels answeredCount 4', ch.answeredCount === 4, JSON.stringify(ch.answeredCount));
  check('Channels mostSelected Email', ch.mostSelected === 'Email', ch.mostSelected);

  // Cleanup
  await req('DELETE', `/forms/${pid}`);

  console.log(`\n  RESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
