/* Ad-hoc Phase 2 verification: response submission + dynamic validation.
   Run with the server up: node scripts/test-phase2.js */
const BASE = 'http://localhost:5000/api';

let pass = 0;
let fail = 0;
function check(name, cond, detail = '') {
  (cond ? (pass++, console.log(`  PASS  ${name}`)) : (fail++, console.log(`  FAIL  ${name}  ${detail}`)));
}

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

(async () => {
  // 1. Create a Job Application form (covers text, email, number min/max, select, multiselect).
  const create = await req('POST', '/forms', {
    title: 'Job Application (phase2 test)',
    fields: [
      { label: 'Name', type: 'text', required: true },
      { label: 'Email', type: 'text', required: true, format: 'email' },
      { label: 'Experience', type: 'number', required: true, min: 0, max: 50 },
      { label: 'Skills', type: 'multiselect', required: true, options: ['React', 'Node', 'MongoDB'] },
      { label: 'Preferred Role', type: 'select', required: true, options: ['Frontend', 'Backend', 'Fullstack'] },
    ],
  });
  check('create form -> 201', create.status === 201, `got ${create.status}`);
  const form = create.json.data;
  const id = {};
  form.fields.forEach((f) => (id[f.label] = f.id));
  const pid = form.publicId;
  console.log(`  (publicId=${pid})`);

  // 2. Valid submission -> 201
  const valid = await req('POST', `/forms/${pid}/responses`, {
    answers: {
      [id.Name]: 'Ada Lovelace',
      [id.Email]: 'ada@example.com',
      [id.Experience]: '7', // string -> coerced to number
      [id.Skills]: ['React', 'Node'],
      [id['Preferred Role']]: 'Fullstack',
    },
  });
  check('valid submission -> 201', valid.status === 201, `got ${valid.status} ${JSON.stringify(valid.json)}`);
  check('number coerced from string', valid.json?.data?.answers?.[id.Experience] === 7,
    JSON.stringify(valid.json?.data?.answers));

  // 3. Missing required field (omit Name) -> 422 on Name
  const missing = await req('POST', `/forms/${pid}/responses`, {
    answers: { [id.Email]: 'x@y.com', [id.Experience]: 3, [id.Skills]: ['React'], [id['Preferred Role']]: 'Backend' },
  });
  check('missing required -> 422', missing.status === 422, `got ${missing.status}`);
  check('  error keyed by Name field id', missing.json?.error?.fields?.[id.Name] !== undefined,
    JSON.stringify(missing.json?.error?.fields));

  // 4. Number out of range (Experience 99 > max 50) -> 422
  const range = await req('POST', `/forms/${pid}/responses`, {
    answers: { [id.Name]: 'X', [id.Email]: 'x@y.com', [id.Experience]: 99, [id.Skills]: ['React'], [id['Preferred Role']]: 'Backend' },
  });
  check('number over max -> 422', range.status === 422 && range.json?.error?.fields?.[id.Experience] !== undefined,
    JSON.stringify(range.json?.error?.fields));

  // 5. Invalid email -> 422
  const email = await req('POST', `/forms/${pid}/responses`, {
    answers: { [id.Name]: 'X', [id.Email]: 'not-an-email', [id.Experience]: 3, [id.Skills]: ['React'], [id['Preferred Role']]: 'Backend' },
  });
  check('invalid email -> 422', email.status === 422 && email.json?.error?.fields?.[id.Email] !== undefined,
    JSON.stringify(email.json?.error?.fields));

  // 6. Invalid select option -> 422
  const sel = await req('POST', `/forms/${pid}/responses`, {
    answers: { [id.Name]: 'X', [id.Email]: 'x@y.com', [id.Experience]: 3, [id.Skills]: ['React'], [id['Preferred Role']]: 'Manager' },
  });
  check('invalid select option -> 422', sel.status === 422 && sel.json?.error?.fields?.[id['Preferred Role']] !== undefined,
    JSON.stringify(sel.json?.error?.fields));

  // 7. Invalid multiselect option -> 422
  const multi = await req('POST', `/forms/${pid}/responses`, {
    answers: { [id.Name]: 'X', [id.Email]: 'x@y.com', [id.Experience]: 3, [id.Skills]: ['React', 'COBOL'], [id['Preferred Role']]: 'Backend' },
  });
  check('invalid multiselect option -> 422', multi.status === 422 && multi.json?.error?.fields?.[id.Skills] !== undefined,
    JSON.stringify(multi.json?.error?.fields));

  // 8. List responses (only the 1 valid one)
  const list = await req('GET', `/forms/${pid}/responses`);
  check('list responses -> 200', list.status === 200, `got ${list.status}`);
  check('exactly 1 stored response', Array.isArray(list.json?.data) && list.json.data.length === 1,
    `count=${list.json?.data?.length}`);
  check('response has submittedAt', !!list.json?.data?.[0]?.submittedAt, '');

  // 9. Cascade delete: form delete removes its responses
  const del = await req('DELETE', `/forms/${pid}`);
  check('delete form cascades responses', del.json?.data?.responsesDeleted === 1,
    JSON.stringify(del.json?.data));
  const after = await req('GET', `/forms/${pid}/responses`);
  check('responses gone after form delete -> 404', after.status === 404, `got ${after.status}`);

  console.log(`\n  RESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
