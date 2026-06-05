const {
  FIELD_TYPES,
  ALL_FIELD_TYPES,
  OPTION_TYPES,
  TEXT_FORMATS,
} = require('./fieldTypes');

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * Validate a Form schema submitted from the Builder, BEFORE it is persisted.
 * Pure function: takes the raw payload, returns a flat map of errors keyed by
 * dotted paths the Builder can map back to inputs, e.g.:
 *   { "title": "...", "fields": "...", "fields.0.label": "...", "fields.1.options": "..." }
 * An empty object means the schema is valid.
 *
 * This guards against nonsense the Builder could otherwise save: no fields,
 * blank labels, unknown types, option-less selects, blank/duplicate options,
 * and inverted number ranges.
 */
function validateFormSchema(payload = {}) {
  const errors = {};

  if (!isNonEmptyString(payload.title)) {
    errors.title = 'Title is required.';
  }

  const fields = payload.fields;
  if (!Array.isArray(fields) || fields.length === 0) {
    errors.fields = 'A form needs at least one field.';
    return errors; // nothing more to check
  }

  fields.forEach((field, i) => {
    const at = (prop) => `fields.${i}.${prop}`;
    const f = field || {};

    if (!isNonEmptyString(f.label)) {
      errors[at('label')] = 'Field label is required.';
    }

    if (!ALL_FIELD_TYPES.includes(f.type)) {
      errors[at('type')] = `Field type must be one of: ${ALL_FIELD_TYPES.join(', ')}.`;
      return; // remaining per-type checks are meaningless without a valid type
    }

    if (OPTION_TYPES.includes(f.type)) {
      const options = f.options;
      if (!Array.isArray(options) || options.length === 0) {
        errors[at('options')] = 'Select fields need at least one option.';
      } else if (options.some((o) => !isNonEmptyString(o))) {
        errors[at('options')] = 'Options cannot be blank.';
      } else {
        const trimmed = options.map((o) => o.trim());
        if (new Set(trimmed).size !== trimmed.length) {
          errors[at('options')] = 'Options must be unique.';
        }
      }
    }

    if (f.type === FIELD_TYPES.NUMBER) {
      const hasMin = f.min !== undefined && f.min !== null;
      const hasMax = f.max !== undefined && f.max !== null;
      if (hasMin && !isNumber(f.min)) errors[at('min')] = 'Min must be a number.';
      if (hasMax && !isNumber(f.max)) errors[at('max')] = 'Max must be a number.';
      if (hasMin && hasMax && isNumber(f.min) && isNumber(f.max) && f.min > f.max) {
        errors[at('max')] = 'Max must be greater than or equal to min.';
      }
    }

    if (f.type === FIELD_TYPES.TEXT && f.format !== undefined && f.format !== null) {
      if (!TEXT_FORMATS.includes(f.format)) {
        errors[at('format')] = `Unsupported text format. Allowed: ${TEXT_FORMATS.join(', ')}.`;
      }
    }
  });

  return errors;
}

module.exports = { validateFormSchema };
