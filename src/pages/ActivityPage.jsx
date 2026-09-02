import DashboardLayout from '../components/DashboardLayout';
import ActivityTimeline from '../components/ActivityTimeline';

export default function ActivityPage() {
  return (
    <DashboardLayout title="Activity">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white">
          Activity Timeline
        </h2>

        <div className="mt-4">
          <ActivityTimeline />
        </div>
      </div>
    </DashboardLayout>
  );
}