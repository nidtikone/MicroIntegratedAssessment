import { useParams } from 'react-router-dom';

export default function RendererPage() {
  const { publicId } = useParams();
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="card w-full max-w-lg p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">Public form</h1>
        <p className="mt-2 text-sm text-slate-500">
          Renderer for <code className="text-brand-700">{publicId}</code> comes in a later phase.
        </p>
      </div>
    </div>
  );
}
