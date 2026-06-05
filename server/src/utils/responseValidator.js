const { FIELD_TYPES, EMAIL_REGEX } = require('./fieldTypes');

/** An answer counts as "not provided" for required-checks. */
function isEmpty(v) {
  return (
    v === undefined ||
    v === null ||
    (typeof v === 'string' && v.trim() === '') ||
    (Array.isArray(v) && v.length === 0)
  );
}

/**
 * Server-authoritative validation of a submitted Response against a Form's
 * schema. This is the source of truth (the client mirrors a thin copy).
 *
 * Returns { errors, values } where:
 *   - errors is a map keyed by field id (only failing fields appear),
 *   - values is the normalized/coerced answer set to persist (only fields that
 *     were actually answered; empty optional fields are omitted).
 *
 * Rules enforced: required presence, number coercion + min/max, email format,
 * select/multiselect option membership, and correct shape per type. Answers for
 * unknown field ids are ignored.
 */
function validateResponse(form, rawAnswers = {}) {
  const errors = {};
  const values = {};

  for (const field of form.fields) {
    const raw = rawAnswers[field.id];

    if (isEmpty(raw)) {
      if (field.required) errors[field.id] = 'This field is required.';
      continue; // nothing to validate or store for an empty optional field
    }

    switch (field.type) {
      case FIELD_TYPES.TEXT: {
        if (typeof raw !== 'string') {
          errors[field.id] = 'Must be text.';
          break;
        }
        const text = raw.trim();
        if (field.format === 'email' && !EMAIL_REGEX.test(text)) {
          errors[field.id] = 'Must be a valid email address.';
          break;
        }
        values[field.id] = text;
        break;
      }

      case FIELD_TYPES.NUMBER: {
        const num = typeof raw === 'number' ? raw : Number(String(raw).trim());
        if (!Number.isFinite(num)) {
          errors[field.id] = 'Must be a number.';
          break;
        }
        if (field.min !== undefined && num < field.min) {
          errors[field.id] = `Must be at least ${field.min}.`;
          break;
        }
        if (field.max !== undefined && num > field.max) {
          errors[field.id] = `Must be at most ${field.max}.`;
          break;
        }
        values[field.id] = num;
        break;
      }

      case FIELD_TYPES.SELECT: {
        if (typeof raw !== 'string' || !field.options.includes(raw.trim())) {
          errors[field.id] = 'Must be one of the allowed options.';
          break;
        }
        values[field.id] = raw.trim();
        break;
      }

      case FIELD_TYPES.MULTISELECT: {
        if (!Array.isArray(raw)) {
          errors[field.id] = 'Must be a list of options.';
          break;
        }
        const picked = raw.map((v) => (typeof v === 'string' ? v.trim() : v));
        const allValid = picked.every((v) => typeof v === 'string' && field.options.includes(v));
        if (!allValid) {
          errors[field.id] = 'Contains an option that is not allowed.';
          break;
        }
        values[field.id] = [...new Set(picked)]; // de-duplicate
        break;
      }

      default:
        // Unknown type should be impossible (schema validated on save), but be safe.
        errors[field.id] = 'Unsupported field type.';
    }
  }

  return { errors, values };
}

module.exports = { validateResponse };
