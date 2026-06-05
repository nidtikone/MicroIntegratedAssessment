import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-5xl font-bold text-slate-300">404</p>
        <h1 className="mt-2 text-lg font-semibold text-slate-700">Page not found</h1>
        <Link to="/" className="btn-primary mt-4">
          Back to forms
        </Link>
      </div>
    </div>
  );
}
