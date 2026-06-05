import type { CreateFormPayload, FieldType, NewFormField } from '../../types';

/** A field being edited in the Builder. min/max are kept as strings for input control. */
export interface DraftField {
  localId: string;
  label: string;
  type: FieldType;
  required: boolean;
  options: string[];
  min: string;
  max: string;
  emailFormat: boolean;
}

export const FIELD_TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select (one)' },
  { value: 'multiselect', label: 'Multi-select' },
];

export const isOptionType = (t: FieldType) => t === 'select' || t === 'multiselect';

export function createField(): DraftField {
  return {
    localId: crypto.randomUUID(),
    label: '',
    type: 'text',
    required: false,
    options: ['', ''],
    min: '',
    max: '',
    emailFormat: false,
  };
}

// --- Validation (mirrors the server's formSchemaValidator) -------------------
export interface FieldErrors {
  label?: string;
  options?: string;
  min?: string;
  max?: string;
}
export interface DraftErrors {
  title?: string;
  form?: string;
  fields: Record<string, FieldErrors>;
}

const isNum = (s: string) => s.trim() !== '' && Number.isFinite(Number(s));

export function validateDraft(title: string, fields: DraftField[]): DraftErrors {
  const errors: DraftErrors = { fields: {} };

  if (title.trim() === '') errors.title = 'Title is required.';
  if (fields.length === 0) errors.form = 'Add at least one field.';

  for (const f of fields) {
    const fe: FieldErrors = {};

    if (f.label.trim() === '') fe.label = 'Label is required.';

    if (isOptionType(f.type)) {
      const opts = f.options.map((o) => o.trim()).filter(Boolean);
      if (opts.length === 0) fe.options = 'Add at least one option.';
      else if (new Set(opts).size !== opts.length) fe.options = 'Options must be unique.';
    }

    if (f.type === 'number') {
      if (f.min.trim() !== '' && !isNum(f.min)) fe.min = 'Must be a number.';
      if (f.max.trim() !== '' && !isNum(f.max)) fe.max = 'Must be a number.';
      if (isNum(f.min) && isNum(f.max) && Number(f.min) > Number(f.max)) {
        fe.max = 'Max must be ≥ min.';
      }
    }

    if (Object.keys(fe).length) errors.fields[f.localId] = fe;
  }

  return errors;
}

export function hasErrors(e: DraftErrors): boolean {
  return Boolean(e.title || e.form) || Object.keys(e.fields).length > 0;
}

// --- Transform draft -> API payload -----------------------------------------
export function toPayload(title: string, description: string, fields: DraftField[]): CreateFormPayload {
  return {
    title: title.trim(),
    description: description.trim(),
    fields: fields.map((f): NewFormField => {
      const base: NewFormField = { label: f.label.trim(), type: f.type, required: f.required };
      if (isOptionType(f.type)) {
        base.options = f.options.map((o) => o.trim()).filter(Boolean);
      }
      if (f.type === 'number') {
        if (isNum(f.min)) base.min = Number(f.min);
        if (isNum(f.max)) base.max = Number(f.max);
      }
      if (f.type === 'text' && f.emailFormat) base.format = 'email';
      return base;
    }),
  };
}
