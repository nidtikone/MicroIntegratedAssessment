import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import NotFoundPage from './components/NotFoundPage';
import FormsListPage from './features/forms/FormsListPage';
import { LoadingState } from './components/StateViews';

// Eager: the landing list. Lazy: everything else, so Recharts (analytics) and
// the builder load only when their route is visited.
const BuilderPage = lazy(() => import('./features/builder/BuilderPage'));
const FormDetailPage = lazy(() => import('./features/forms/FormDetailPage'));
const RendererPage = lazy(() => import('./features/renderer/RendererPage'));
const SubmittedPage = lazy(() => import('./features/renderer/SubmittedPage'));

const withSuspense = (node: ReactNode) => (
  <Suspense fallback={<LoadingState />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <FormsListPage /> },
      { path: '/builder', element: withSuspense(<BuilderPage />) },
      { path: '/forms/:publicId', element: withSuspense(<FormDetailPage />) },
    ],
  },
  // Public surfaces live outside the admin shell.
  { path: '/f/:publicId', element: withSuspense(<RendererPage />) },
  { path: '/f/:publicId/submitted', element: withSuspense(<SubmittedPage />) },
  { path: '*', element: <NotFoundPage /> },
]);
