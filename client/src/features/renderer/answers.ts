import type { AnswerValue, FormField } from '../../types';
import { EMAIL_REGEX, isEmptyAnswer } from '../../utils/validation';

/** Local form state: text/number/select -> string, multiselect -> string[]. */
export type AnswerState = Record<string, string | string[]>;

export function initialAnswers(fields: FormField[]): AnswerState {
  const state: AnswerState = {};
  for (const f of fields) state[f.id] = f.type === 'multiselect' ? [] : '';
  return state;
}

/**
 * Client-side validation mirroring the server's responseValidator. Returns a
 * map of fieldId -> message (only failing fields). The server remains the
 * source of truth.
 */
export function validateAnswers(fields: FormField[], values: AnswerState): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const v = values[field.id];

    if (isEmptyAnswer(v)) {
      if (field.required) errors[field.id] = 'This field is required.';
      continue;
    }

    if (field.type === 'number') {
      const num = Number(String(v).trim());
      if (!Number.isFinite(num)) errors[field.id] = 'Must be a number.';
      else if (field.min !== undefined && num < field.min) errors[field.id] = `Must be at least ${field.min}.`;
      else if (field.max !== undefined && num > field.max) errors[field.id] = `Must be at most ${field.max}.`;
    } else if (field.type === 'text' && field.format === 'email') {
      if (!EMAIL_REGEX.test(String(v).trim())) errors[field.id] = 'Must be a valid email address.';
    } else if (field.type === 'select') {
      if (!field.options?.includes(v as string)) errors[field.id] = 'Must be one of the allowed options.';
    } else if (field.type === 'multiselect') {
      const picked = v as string[];
      if (!picked.every((o) => field.options?.includes(o))) {
        errors[field.id] = 'Contains an option that is not allowed.';
      }
    }
  }

  return errors;
}

/** Build the API payload: numbers coerced, empty optionals omitted. */
export function toAnswerPayload(fields: FormField[], values: AnswerState): Record<string, AnswerValue> {
  const out: Record<string, AnswerValue> = {};
  for (const field of fields) {
    const v = values[field.id];
    if (isEmptyAnswer(v)) continue;
    if (field.type === 'number') out[field.id] = Number(String(v).trim());
    else out[field.id] = v;
  }
  return out;
}
