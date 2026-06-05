import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutGrid, Plus } from 'lucide-react';

/** Admin shell: top navigation + routed content. Public renderer sits outside this. */
export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
              <LayoutGrid size={16} />
            </span>
            FormForge
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
                }`
              }
            >
              Forms
            </NavLink>
            <Link to="/builder" className="btn-primary ml-1">
              <Plus size={16} /> New form
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
