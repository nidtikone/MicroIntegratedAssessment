import { Inbox } from 'lucide-react';
import { useListResponsesQuery } from '../api/apiSlice';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateViews';
import { getErrorMessage } from '../../utils/apiError';
import { formatDate, relativeTime } from '../../utils/time';
import AnswerCell from './AnswerCell';
import type { FormField } from '../../types';

export default function ResponsesTab({ publicId, fields }: { publicId: string; fields: FormField[] }) {
  const { data: responses, isLoading, isError, error, refetch } = useListResponsesQuery(publicId);

  if (isLoading) return <LoadingState label="Loading responses…" />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  if (!responses || responses.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={32} />}
        title="No responses yet"
        description="Share this form's link to start collecting responses."
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">
        {responses.length} {responses.length === 1 ? 'response' : 'responses'}
      </p>
      <div className="card max-h-[70vh] overflow-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="text-left">
              <th className="sticky top-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-400">
                #
              </th>
              {fields.map((f) => (
                <th
                  key={f.id}
                  className="sticky top-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-600"
                >
                  {f.label}
                </th>
              ))}
              <th className="sticky top-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-400">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody>
            {responses.map((r, i) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                {fields.map((f) => (
                  <td key={f.id} className="px-4 py-3 align-top">
                    <AnswerCell field={f} value={r.answers[f.id]} />
                  </td>
                ))}
                <td
                  className="whitespace-nowrap px-4 py-3 text-slate-400"
                  title={formatDate(r.submittedAt)}
                >
                  {relativeTime(r.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
