import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import NotFoundPage from './components/NotFoundPage';
import FormsListPage from './features/forms/FormsListPage';
import FormDetailPage from './features/forms/FormDetailPage';
import BuilderPage from './features/builder/BuilderPage';
import RendererPage from './features/renderer/RendererPage';
import SubmittedPage from './features/renderer/SubmittedPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <FormsListPage /> },
      { path: '/builder', element: <BuilderPage /> },
      { path: '/forms/:publicId', element: <FormDetailPage /> },
    ],
  },
  // Public surfaces live outside the admin shell.
  { path: '/f/:publicId', element: <RendererPage /> },
  { path: '/f/:publicId/submitted', element: <SubmittedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
