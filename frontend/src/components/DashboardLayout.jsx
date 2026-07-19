import { ChevronRight, LayoutGrid, ListChecks, CalendarDays, UserCircle2, LogOut, FolderKanban } from 'lucide-react';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
  { label: 'Projects', icon: FolderKanban, path: '/projects' },
  { label: 'Tasks', icon: ListChecks, path: '/tasks' },
  { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { label: 'Profile', icon: UserCircle2, path: '/profile' },
];

export default function DashboardLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="sidebar w-full border-b border-slate-800 bg-slate-900/90 px-4 py-5 lg:w-72 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <SearchBar />
                </div>
                <NotificationBell />
                <div className="profile-bubble flex items-center gap-3 rounded-full border border-slate-800 bg-slate-800/80 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 font-semibold text-cyan-300">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-400">{user?.role || 'Team Member'}</p>
                  </div>
                </div>
              </div>
                  to={path}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                      isActive ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ) : (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              )
            )}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl border border-slate-800 px-3 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Productivity hub</p>
                <h1 className="text-xl font-semibold text-white">{title}</h1>
              </div>

              <div className="flex items-center gap-3">
                  <div className="mr-2"><NotificationBell /></div>
                <div className="profile-bubble flex items-center gap-3 rounded-full border border-slate-800 bg-slate-800/80 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 font-semibold text-cyan-300">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-400">{user?.role || 'Team Member'}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
