const { FIELD_TYPES, OPTION_TYPES } = require('./fieldTypes');

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Compute analytics for one Form across its Responses. Pure function — no DB.
 *
 * Returns:
 * {
 *   totalResponses,
 *   fields: [ per-field analytics, in form field order ]
 * }
 *
 * Per field type:
 *   select / multiselect -> {
 *     id, label, type,
 *     distribution: [{ option, count }] over ALL defined options, sorted desc,
 *     mostSelected: option string | null,
 *     answeredCount, totalSelections
 *   }
 *   number -> { id, label, type, average, min, max, count }
 *   text   -> { id, label, type, answeredCount }
 */
function computeAnalytics(form, responses = []) {
  const answersOf = (r) => r.answers || {};

  const fields = form.fields.map((field) => {
    const base = { id: field.id, label: field.label, type: field.type };

    if (OPTION_TYPES.includes(field.type)) {
      // Seed every defined option at 0 so charts show the full set.
      const counts = new Map(field.options.map((o) => [o, 0]));
      let answeredCount = 0;
      let totalSelections = 0;

      for (const r of responses) {
        const val = answersOf(r)[field.id];
        if (field.type === FIELD_TYPES.SELECT) {
          if (typeof val === 'string' && counts.has(val)) {
            counts.set(val, counts.get(val) + 1);
            answeredCount += 1;
            totalSelections += 1;
          }
        } else {
          // multiselect
          if (Array.isArray(val) && val.length > 0) {
            answeredCount += 1;
            for (const v of val) {
              if (counts.has(v)) {
                counts.set(v, counts.get(v) + 1);
                totalSelections += 1;
              }
            }
          }
        }
      }

      const distribution = [...counts.entries()]
        .map(([option, count]) => ({ option, count }))
        .sort((a, b) => b.count - a.count);

      const mostSelected =
        distribution.length && distribution[0].count > 0 ? distribution[0].option : null;

      return { ...base, distribution, mostSelected, answeredCount, totalSelections };
    }

    if (field.type === FIELD_TYPES.NUMBER) {
      const nums = [];
      for (const r of responses) {
        const val = answersOf(r)[field.id];
        if (typeof val === 'number' && Number.isFinite(val)) nums.push(val);
      }
      if (nums.length === 0) {
        return { ...base, average: null, min: null, max: null, count: 0 };
      }
      const sum = nums.reduce((a, b) => a + b, 0);
      return {
        ...base,
        average: round2(sum / nums.length),
        min: Math.min(...nums),
        max: Math.max(...nums),
        count: nums.length,
      };
    }

    // text (and any non-aggregated type): just how many responses filled it in.
    let answeredCount = 0;
    for (const r of responses) {
      const val = answersOf(r)[field.id];
      if (typeof val === 'string' && val.trim() !== '') answeredCount += 1;
    }
    return { ...base, answeredCount };
  });

  return { totalResponses: responses.length, fields };
}

module.exports = { computeAnalytics };
