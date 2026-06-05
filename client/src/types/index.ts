// Domain types mirrored from the backend contract (see CONTEXT.md).

export type FieldType = 'text' | 'number' | 'select' | 'multiselect';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // select | multiselect
  min?: number; // number
  max?: number; // number
  format?: 'email'; // text
}

export interface FormSchema {
  publicId: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSummary {
  publicId: string;
  title: string;
  description: string;
  fieldCount: number;
  createdAt: string;
  updatedAt: string;
}

export type AnswerValue = string | number | string[];

export interface ResponseRecord {
  id: string;
  answers: Record<string, AnswerValue>;
  submittedAt: string;
}

// --- Create payload (Builder -> POST /forms): fields without server-assigned id ---
export interface NewFormField {
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  format?: 'email';
}

export interface CreateFormPayload {
  title: string;
  description?: string;
  fields: NewFormField[];
}

// --- Analytics ---
export interface DistributionEntry {
  option: string;
  count: number;
}

export interface SelectFieldAnalytics {
  id: string;
  label: string;
  type: 'select' | 'multiselect';
  distribution: DistributionEntry[];
  mostSelected: string | null;
  answeredCount: number;
  totalSelections: number;
}

export interface NumberFieldAnalytics {
  id: string;
  label: string;
  type: 'number';
  average: number | null;
  min: number | null;
  max: number | null;
  count: number;
}

export interface TextFieldAnalytics {
  id: string;
  label: string;
  type: 'text';
  answeredCount: number;
}

export type FieldAnalytics =
  | SelectFieldAnalytics
  | NumberFieldAnalytics
  | TextFieldAnalytics;

export interface FormAnalytics {
  formPublicId: string;
  title: string;
  totalResponses: number;
  fields: FieldAnalytics[];
}

// --- API envelope ---
export interface ApiError {
  message: string;
  code: string;
  fields?: Record<string, string>;
}
