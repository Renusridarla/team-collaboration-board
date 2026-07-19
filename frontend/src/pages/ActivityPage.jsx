import DashboardLayout from '../components/DashboardLayout';
import ActivityTimeline from '../components/ActivityTimeline';

export default function ActivityPage() {
  return (
    <DashboardLayout title="Activity">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <p className="text-sm text-slate-400">All team actions, newest first</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-800/70 p-6">
          <ActivityTimeline limit={200} />
        </div>
      </div>
    </DashboardLayout>
  );
}
