import { useParams, Link } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useGetFormQuery } from '../api/apiSlice';
import { LoadingState, ErrorState } from '../../components/StateViews';
import { getApiError, getErrorMessage } from '../../utils/apiError';
import CopyButton from '../../components/ui/CopyButton';
import ResponsesTab from '../responses/ResponsesTab';
import AnalyticsTab from '../analytics/AnalyticsTab';

const tabTrigger =
  'px-4 py-2 text-sm font-medium text-slate-500 border-b-2 border-transparent transition-colors hover:text-slate-700 data-[state=active]:border-brand-600 data-[state=active]:text-brand-700';

export default function FormDetailPage() {
  const { publicId = '' } = useParams();
  const { data: form, isLoading, isError, error, refetch } = useGetFormQuery(publicId);

  if (isLoading) return <LoadingState label="Loading form…" />;
  if (isError || !form) {
    const apiErr = getApiError(error);
    return (
      <ErrorState
        message={apiErr?.code === 'NOT_FOUND' ? 'Form not found.' : getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  const shareUrl = `${window.location.origin}/f/${form.publicId}`;

  return (
    <div>
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={15} /> All forms
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{form.title}</h1>
          {form.description && <p className="mt-1 text-sm text-slate-500">{form.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={shareUrl} />
          <a href={`/f/${form.publicId}`} target="_blank" rel="noreferrer" className="btn-ghost">
            <ExternalLink size={16} /> Open form
          </a>
        </div>
      </div>

      <Tabs.Root defaultValue="responses">
        <Tabs.List className="flex gap-1 border-b border-slate-200">
          <Tabs.Trigger value="responses" className={tabTrigger}>
            Responses
          </Tabs.Trigger>
          <Tabs.Trigger value="analytics" className={tabTrigger}>
            Analytics
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="responses" className="pt-6 focus:outline-none">
          <ResponsesTab publicId={form.publicId} fields={form.fields} />
        </Tabs.Content>
        <Tabs.Content value="analytics" className="pt-6 focus:outline-none">
          <AnalyticsTab publicId={form.publicId} fields={form.fields} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
