import { ChevronRight, LayoutGrid, ListChecks, CalendarDays, UserCircle2, LogOut, FolderKanban, Activity, Users, Building2 } from 'lucide-react';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';
import CustomCursor from './CustomCursor';
import ScrollProgress from './ScrollProgress';
import Magnetic from './Magnetic';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-900 selection:text-white overflow-hidden">
      {/* Scroll Progress Line */}
      <ScrollProgress />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Ambient background glowing color spheres for SaaS feel */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px] z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-600/05 blur-[150px] z-0" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="sidebar w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 py-5 lg:w-64 lg:border-b-0 lg:border-r flex flex-col justify-between shrink-0">
          <div>
            {/* Logo / Brand */}
            <div className="flex items-center gap-3 px-2 mb-6">
              <Magnetic strength={4}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105">
                  TC
                </div>
              </Magnetic>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Collaboration</h2>
                <p className="text-xs text-indigo-400 font-medium">Team SaaS Hub</p>
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
                        ? "bg-zinc-800/90 text-white border border-indigo-500/30 shadow-md shadow-indigo-500/5"
                        : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? "text-indigo-400" : "text-zinc-400 transition-transform duration-200 group-hover:scale-110"} />
                      <span>{label}</span>
                      <ChevronRight className={`ml-auto transition-opacity ${isActive ? "opacity-90 text-indigo-400" : "opacity-30 group-hover:opacity-80"}`} size={15} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Profile & Logout at bottom */}
          <div className="mt-8 pt-4 border-t border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-3 px-2 py-1">
              <Magnetic strength={4}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 font-bold text-indigo-400 text-sm shadow">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </Magnetic>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-zinc-400 truncate">{user?.email || ''}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3.5 py-2 text-sm text-zinc-400 btn-interaction hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-transparent">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Workspace Hub</p>
                <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block w-64">
                  <SearchBar />
                </div>
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
