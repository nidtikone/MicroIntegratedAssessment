import type { AnswerValue, FormField } from '../../types';
import { isEmptyAnswer } from '../../utils/validation';

/** Renders one answer in the Response Viewer, formatted by field type. */
export default function AnswerCell({ field, value }: { field: FormField; value: AnswerValue | undefined }) {
  if (isEmptyAnswer(value)) {
    return <span className="text-slate-300">—</span>;
  }

  if (field.type === 'multiselect' && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((v) => (
          <span
            key={v}
            className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
          >
            {v}
          </span>
        ))}
      </div>
    );
  }

  return <span className="text-slate-700">{String(value)}</span>;
}
