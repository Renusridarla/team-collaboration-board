import { ChevronRight, LayoutGrid, ListChecks, CalendarDays, UserCircle2, LogOut, FolderKanban, Activity, Users, Building2 } from 'lucide-react';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';
import CustomCursor from './CustomCursor';
import ScrollProgress from './ScrollProgress';
import Magnetic from './Magnetic';
import ThemeToggle from './ThemeToggle';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
  { label: 'Workspaces', icon: Building2, path: '/workspaces' },
  { label: 'Projects', icon: FolderKanban, path: '/projects' },
  { label: 'Tasks', icon: ListChecks, path: '/tasks' },
  { label: 'Team', icon: Users, path: '/team' },
  { label: 'Activity', icon: Activity, path: '/activity' },
  { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { label: 'Profile', icon: UserCircle2, path: '/profile' },
];

export default function DashboardLayout({ title, children }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === 'light';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`relative min-h-screen font-sans overflow-hidden transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900' : 'bg-zinc-950 text-zinc-100 selection:bg-indigo-900 selection:text-white'
    }`}>
      {/* Scroll Progress Line */}
      <ScrollProgress />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Ambient background glowing color spheres */}
      <div className={`pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[130px] z-0 transition-opacity duration-300 ${
        isLight ? 'bg-indigo-400/10' : 'bg-indigo-600/10'
      }`} />
      <div className={`pointer-events-none fixed bottom-0 right-0 h-[600px] w-[600px] rounded-full blur-[150px] z-0 transition-opacity duration-300 ${
        isLight ? 'bg-purple-400/10' : 'bg-purple-600/05'
      }`} />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className={`sidebar w-full border-b backdrop-blur-md px-4 py-5 lg:w-64 lg:border-b-0 lg:border-r flex flex-col justify-between shrink-0 transition-colors duration-300 ${
          isLight ? 'border-slate-200 bg-white/90' : 'border-zinc-800/80 bg-zinc-950/80'
        }`}>
          <div>
            {/* Logo / Brand */}
            <div className="flex items-center gap-3 px-2 mb-6">
              <Magnetic strength={4}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105">
                  TC
                </div>
              </Magnetic>
              <div>
                <h2 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Collaboration</h2>
                <p className="text-xs text-indigo-500 font-medium">Team SaaS Hub</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isLight
                          ? "bg-slate-100 text-slate-900 border border-slate-300 shadow-sm"
                          : "bg-zinc-800/90 text-white border border-indigo-500/30 shadow-md shadow-indigo-500/5"
                        : isLight
                        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? "text-indigo-500" : isLight ? "text-slate-500 transition-transform duration-200 group-hover:scale-110" : "text-zinc-400 transition-transform duration-200 group-hover:scale-110"} />
                      <span>{label}</span>
                      <ChevronRight className={`ml-auto transition-opacity ${isActive ? "opacity-90 text-indigo-500" : "opacity-30 group-hover:opacity-80"}`} size={15} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Profile & Logout at bottom */}
          <div className={`mt-8 pt-4 border-t space-y-3 ${isLight ? 'border-slate-200' : 'border-zinc-800/80'}`}>
            <div className="flex items-center gap-3 px-2 py-1">
              <Magnetic strength={4}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border font-bold text-sm shadow ${
                  isLight ? 'bg-slate-100 border-slate-300 text-indigo-600' : 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 text-indigo-400'
                }`}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </Magnetic>
              <div className="overflow-hidden">
                <p className={`text-sm font-medium truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{user?.name || 'User'}</p>
                <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{user?.email || ''}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2 text-sm btn-interaction transition-colors ${
                isLight
                  ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-transparent">
          {/* Header */}
          <header className={`sticky top-0 z-20 border-b backdrop-blur-md px-4 py-4 sm:px-6 transition-colors duration-300 ${
            isLight ? 'border-slate-200 bg-white/80' : 'border-zinc-800/80 bg-zinc-950/80'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Workspace Hub</p>
                <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block w-64">
                  <SearchBar />
                </div>
                <ThemeToggle />
                <NotificationBell />
              </div>
            </div>
          </header>

          {/* Content Body with Page Transition */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
