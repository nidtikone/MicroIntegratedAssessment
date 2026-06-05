import { useParams } from 'react-router-dom';

export default function FormDetailPage() {
  const { publicId } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Form detail</h1>
      <p className="mt-2 text-sm text-slate-500">
        Responses &amp; analytics for <code className="text-brand-700">{publicId}</code> come in later phases.
      </p>
    </div>
  );
}
