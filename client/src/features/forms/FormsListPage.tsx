import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';
import { useListFormsQuery } from '../api/apiSlice';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateViews';
import { getErrorMessage } from '../../utils/apiError';

export default function FormsListPage() {
  const { data: forms, isLoading, isError, error, refetch } = useListFormsQuery();

  if (isLoading) return <LoadingState label="Loading forms…" />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Forms</h1>
        <p className="mt-1 text-sm text-slate-500">Build, share, and analyze your forms.</p>
      </div>

      {!forms || forms.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="No forms yet"
          description="Create your first form to start collecting responses."
          action={
            <Link to="/builder" className="btn-primary mt-2">
              Create a form
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form, i) => (
            <motion.div
              key={form.publicId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/forms/${form.publicId}`}
                className="card group block h-full p-5 transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
                    {form.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {form.fieldCount} fields
                  </span>
                </div>
                {form.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{form.description}</p>
                )}
                <div className="mt-4 flex items-center gap-1 text-xs text-brand-600">
                  <ExternalLink size={13} />
                  <span className="truncate">/f/{form.publicId}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
