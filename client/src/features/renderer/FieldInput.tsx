import type { FormField } from '../../types';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';

interface FieldInputProps {
  field: FormField;
  value: string | string[];
  error?: string;
  onChange: (value: string | string[]) => void;
}

/** Renders the correct input for a field's type. The heart of dynamic rendering. */
export default function FieldInput({ field, value, error, onChange }: FieldInputProps) {
  const invalid = Boolean(error);

  return (
    <div>
      <label className="label mb-1.5">
        {field.label}
        {field.required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {field.type === 'text' && (
        <input
          className={`input ${invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
          type={field.format === 'email' ? 'email' : 'text'}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'number' && (
        <input
          className={`input ${invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
          inputMode="numeric"
          value={value as string}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'select' && (
        <Select
          value={(value as string) || undefined}
          onValueChange={onChange}
          options={(field.options ?? []).map((o) => ({ value: o, label: o }))}
          placeholder="Select an option…"
          invalid={invalid}
        />
      )}

      {field.type === 'multiselect' && (
        <div className="space-y-2 rounded-lg border border-slate-200 p-3">
          {(field.options ?? []).map((opt) => {
            const arr = value as string[];
            const checked = arr.includes(opt);
            return (
              <Checkbox
                key={opt}
                checked={checked}
                onCheckedChange={(on) =>
                  onChange(on ? [...arr, opt] : arr.filter((o) => o !== opt))
                }
                label={opt}
              />
            );
          })}
        </div>
      )}

      {field.type === 'number' && (field.min !== undefined || field.max !== undefined) && !error && (
        <p className="mt-1.5 text-xs text-slate-400">
          {field.min !== undefined && field.max !== undefined
            ? `Between ${field.min} and ${field.max}`
            : field.min !== undefined
              ? `Minimum ${field.min}`
              : `Maximum ${field.max}`}
        </p>
      )}

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
