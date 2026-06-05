import type { FormField } from '../../types';

// Placeholder — implemented in F5.
export default function AnalyticsTab({ publicId }: { publicId: string; fields: FormField[] }) {
  return (
    <p className="text-sm text-slate-500">
      Analytics for <code className="text-brand-700">{publicId}</code> arrive in the next phase.
    </p>
  );
}
