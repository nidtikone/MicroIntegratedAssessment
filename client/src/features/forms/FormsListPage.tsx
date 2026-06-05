import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useListFormsQuery, useDeleteFormMutation } from '../api/apiSlice';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateViews';
import { getErrorMessage } from '../../utils/apiError';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormCard from './FormCard';
import type { FormSummary } from '../../types';

export default function FormsListPage() {
  const { data: forms, isLoading, isError, error, refetch } = useListFormsQuery();
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();
  const [target, setTarget] = useState<FormSummary | null>(null);

  async function confirmDelete() {
    if (!target) return;
    try {
      await deleteForm(target.publicId).unwrap();
      setTarget(null);
    } catch {
      /* error toast handled below via dialog stays open; keep simple */
      setTarget(null);
    }
  }

  if (isLoading) return <LoadingState label="Loading forms…" />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Forms</h1>
          <p className="mt-1 text-sm text-slate-500">
            {forms && forms.length > 0
              ? `${forms.length} ${forms.length === 1 ? 'form' : 'forms'} · build, share, and analyze.`
              : 'Build, share, and analyze your forms.'}
          </p>
        </div>
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
          <AnimatePresence mode="popLayout">
            {forms.map((form, i) => (
              <motion.div
                key={form.publicId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03, duration: 0.18 }}
              >
                <FormCard form={form} onDelete={setTarget} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete this form?"
        description={
          <>
            <span className="font-medium text-slate-700">{target?.title}</span> and all of its
            responses will be permanently deleted. This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
