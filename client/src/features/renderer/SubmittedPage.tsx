import { CheckCircle2 } from 'lucide-react';

export default function SubmittedPage() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="card w-full max-w-lg p-8 text-center">
        <CheckCircle2 className="mx-auto text-green-500" size={48} />
        <h1 className="mt-3 text-xl font-bold text-slate-900">Response submitted</h1>
        <p className="mt-2 text-sm text-slate-500">Thank you! Your response has been recorded.</p>
      </div>
    </div>
  );
}
