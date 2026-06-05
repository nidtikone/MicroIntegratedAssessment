import { BarChart3, Users } from 'lucide-react';
import { useGetAnalyticsQuery } from '../api/apiSlice';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateViews';
import { getErrorMessage } from '../../utils/apiError';
import KpiCard from './KpiCard';
import NumberStatCard from './NumberStatCard';
import DistributionChart from './DistributionChart';
import type { NumberFieldAnalytics, SelectFieldAnalytics } from '../../types';

export default function AnalyticsTab({ publicId }: { publicId: string }) {
  const { data, isLoading, isError, error, refetch } = useGetAnalyticsQuery(publicId);

  if (isLoading) return <LoadingState label="Computing analytics…" />;
  if (isError || !data) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  if (data.totalResponses === 0) {
    return (
      <EmptyState
        icon={<BarChart3 size={32} />}
        title="No analytics yet"
        description="Once this form receives responses, you'll see distributions and averages here."
      />
    );
  }

  const numberFields = data.fields.filter(
    (f): f is NumberFieldAnalytics => f.type === 'number'
  );
  const distributionFields = data.fields.filter(
    (f): f is SelectFieldAnalytics => f.type === 'select' || f.type === 'multiselect'
  );

  return (
    <div className="space-y-6">
      {/* KPI + numeric stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total responses"
          value={data.totalResponses}
          icon={<Users size={18} />}
          accent
        />
        {numberFields.map((f) => (
          <NumberStatCard key={f.id} field={f} />
        ))}
      </div>

      {/* Distribution charts */}
      {distributionFields.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {distributionFields.map((f) => (
            <DistributionChart key={f.id} field={f} />
          ))}
        </div>
      )}
    </div>
  );
}
