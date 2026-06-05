import { Link } from 'react-router-dom';
import { ExternalLink, Trash2 } from 'lucide-react';
import type { FormSummary } from '../../types';
import { relativeTime } from '../../utils/time';
import CopyButton from '../../components/ui/CopyButton';

interface FormCardProps {
  form: FormSummary;
  onDelete: (form: FormSummary) => void;
}

export default function FormCard({ form, onDelete }: FormCardProps) {
  const shareUrl = `${window.location.origin}/f/${form.publicId}`;

  return (
    <div className="card flex h-full flex-col p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/forms/${form.publicId}`}
          className="font-semibold text-slate-900 hover:text-brand-700"
        >
          {form.title}
        </Link>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {form.fieldCount} {form.fieldCount === 1 ? 'field' : 'fields'}
        </span>
      </div>

      {form.description ? (
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{form.description}</p>
      ) : (
        <p className="mt-1 text-sm italic text-slate-400">No description</p>
      )}

      <div className="mt-auto pt-4 text-xs text-slate-400">Created {relativeTime(form.createdAt)}</div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1">
          <CopyButton text={shareUrl} />
          <a
            href={`/f/${form.publicId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <ExternalLink size={13} /> Open
          </a>
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(form)}
          aria-label={`Delete ${form.title}`}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
