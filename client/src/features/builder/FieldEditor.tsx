import { GripVertical, Trash2 } from 'lucide-react';
import type { DraftField } from './draft';
import { FIELD_TYPE_OPTIONS, isOptionType } from './draft';
import type { FieldErrors } from './draft';
import type { FieldType } from '../../types';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import OptionsEditor from './OptionsEditor';

interface FieldEditorProps {
  field: DraftField;
  index: number;
  errors?: FieldErrors;
  onChange: (patch: Partial<DraftField>) => void;
  onRemove: () => void;
}

export default function FieldEditor({ field, index, errors, onChange, onRemove }: FieldEditorProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="mt-2 text-slate-300">
          <GripVertical size={16} />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Field {index + 1}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>

          {/* Label + type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label mb-1.5">Label</label>
              <input
                className={`input ${errors?.label ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={field.label}
                placeholder="e.g. Full Name"
                onChange={(e) => onChange({ label: e.target.value })}
              />
              {errors?.label && <p className="mt-1.5 text-xs text-red-600">{errors.label}</p>}
            </div>
            <div>
              <label className="label mb-1.5">Type</label>
              <Select
                value={field.type}
                onValueChange={(v) => onChange({ type: v as FieldType })}
                options={FIELD_TYPE_OPTIONS}
              />
            </div>
          </div>

          {/* Type-specific controls */}
          {isOptionType(field.type) && (
            <OptionsEditor
              options={field.options}
              onChange={(options) => onChange({ options })}
              error={errors?.options}
            />
          )}

          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label mb-1.5">Min (optional)</label>
                <input
                  className={`input ${errors?.min ? 'border-red-400' : ''}`}
                  value={field.min}
                  inputMode="numeric"
                  placeholder="—"
                  onChange={(e) => onChange({ min: e.target.value })}
                />
                {errors?.min && <p className="mt-1.5 text-xs text-red-600">{errors.min}</p>}
              </div>
              <div>
                <label className="label mb-1.5">Max (optional)</label>
                <input
                  className={`input ${errors?.max ? 'border-red-400' : ''}`}
                  value={field.max}
                  inputMode="numeric"
                  placeholder="—"
                  onChange={(e) => onChange({ max: e.target.value })}
                />
                {errors?.max && <p className="mt-1.5 text-xs text-red-600">{errors.max}</p>}
              </div>
            </div>
          )}

          {/* Flags */}
          <div className="flex flex-wrap items-center gap-5 pt-1">
            <Checkbox
              checked={field.required}
              onCheckedChange={(required) => onChange({ required })}
              label="Required"
            />
            {field.type === 'text' && (
              <Checkbox
                checked={field.emailFormat}
                onCheckedChange={(emailFormat) => onChange({ emailFormat })}
                label="Validate as email"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
