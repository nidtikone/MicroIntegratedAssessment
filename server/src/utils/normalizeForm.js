const { nanoid } = require('nanoid');
const { FIELD_TYPES, OPTION_TYPES } = require('./fieldTypes');

/** Stable, unguessable public identifier for a Form's shareable link. */
const newPublicId = () => nanoid(10);

/** Stable per-field id. Generated server-side so it never depends on the client. */
const newFieldId = () => `f_${nanoid(8)}`;

/**
 * Turn a validated raw payload into a clean Form document:
 *  - assigns a stable server-generated id to every field (ADR 0001),
 *  - keeps only the attributes relevant to each field type,
 *  - assigns a nanoid publicId.
 * Assumes the payload already passed validateFormSchema.
 */
function normalizeForm(payload) {
  const fields = payload.fields.map((f) => {
    const base = {
      id: newFieldId(),
      label: f.label.trim(),
      type: f.type,
      required: Boolean(f.required),
    };

    if (OPTION_TYPES.includes(f.type)) {
      base.options = f.options.map((o) => o.trim());
    }

    if (f.type === FIELD_TYPES.NUMBER) {
      if (f.min !== undefined && f.min !== null) base.min = f.min;
      if (f.max !== undefined && f.max !== null) base.max = f.max;
    }

    if (f.type === FIELD_TYPES.TEXT && f.format) {
      base.format = f.format;
    }

    return base;
  });

  return {
    publicId: newPublicId(),
    title: payload.title.trim(),
    description: typeof payload.description === 'string' ? payload.description.trim() : '',
    fields,
  };
}

module.exports = { normalizeForm, newPublicId, newFieldId };
