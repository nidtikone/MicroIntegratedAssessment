/**
 * Field type vocabulary shared across schema validation, response validation,
 * and analytics. Keep this the single source of truth for what a Field can be.
 */
const FIELD_TYPES = Object.freeze({
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
});

const ALL_FIELD_TYPES = Object.freeze(Object.values(FIELD_TYPES));

/** Types whose answers are drawn from a fixed Option list. */
const OPTION_TYPES = Object.freeze([FIELD_TYPES.SELECT, FIELD_TYPES.MULTISELECT]);

/** Supported text formats (extra validation flags on a text field). */
const TEXT_FORMATS = Object.freeze(['email']);

// Pragmatic email shape check; mirrored verbatim on the client.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
  FIELD_TYPES,
  ALL_FIELD_TYPES,
  OPTION_TYPES,
  TEXT_FORMATS,
  EMAIL_REGEX,
};
