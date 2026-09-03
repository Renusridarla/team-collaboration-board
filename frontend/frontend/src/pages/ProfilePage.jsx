import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Profile">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300 text-xl font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{user?.name || 'User'}</h2>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
          <h3 className="text-sm font-medium text-white">Account</h3>
          <div className="mt-3 text-sm text-slate-400">Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
