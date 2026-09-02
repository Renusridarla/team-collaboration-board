import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ActivityTimeline from '../components/ActivityTimeline';
import AnimatedCounter from '../components/AnimatedCounter';
import TiltCard from '../components/TiltCard';
import Magnetic from '../components/Magnetic';
import { StatCardSkeleton } from '../components/SkeletonLoader';
import api from '../services/api';
import { Calendar, FolderKanban, CheckCircle2, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const handler = () => loadDashboardData();
    window.addEventListener('tasksUpdated', handler);
    return () => window.removeEventListener('tasksUpdated', handler);
  }, []);

  const statItems = [
    { title: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderKanban, change: 'Active', delay: '0ms' },
    { title: 'Total Tasks', value: stats?.totalTasks ?? 0, icon: Clock, change: 'Assigned & Created', delay: '50ms' },
    { title: 'Completed Tasks', value: stats?.completedTasks ?? 0, icon: CheckCircle2, change: 'Finished', delay: '100ms' },
    { title: 'Pending Tasks', value: stats?.pendingTasks ?? 0, icon: Clock, change: 'To Do', delay: '150ms' },
    { title: 'Team Members', value: stats?.teamMembers ?? 1, icon: Users, change: 'Collaborators', delay: '200ms' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {loading ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </section>
        ) : error ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-400">
            <p>{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white btn-interaction hover:bg-zinc-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Dynamic Stat Cards with 3D Tilt & Staggered Entrance */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {statItems.map((s) => (
                <TiltCard
                  key={s.title}
                  className="p-5 flex flex-col justify-between animate-fade-in"
                  style={{ animationDelay: s.delay }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{s.title}</span>
                    <s.icon size={18} className="text-zinc-500 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-extrabold text-white tracking-tight">
                      <AnimatedCounter value={s.value} />
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">{s.change}</p>
                  </div>
                </TiltCard>
              ))}
            </section>

            {/* Content Split: Recent Activity & Deadlines */}
            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              {/* Recent Activity */}
              <TiltCard className="p-5 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Recent Activity</h2>
                    <p className="text-xs text-zinc-400">Real-time updates from workspace team members</p>
                  </div>
                  <Magnetic strength={4}>
                    <button
                      onClick={() => window.location.assign('/activity')}
                      className="flex items-center gap-1 text-xs font-medium text-zinc-300 btn-interaction hover:text-white"
                    >
                      View all <ArrowUpRight size={14} />
                    </button>
                  </Magnetic>
                </div>
                <div className="mt-4 space-y-3">
                  <ActivityTimeline limit={8} />
                </div>
              </TiltCard>

              {/* Upcoming Deadlines */}
              <TiltCard className="p-5 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Upcoming Deadlines</h2>
                    <p className="text-xs text-zinc-400">Tasks requiring attention from MongoDB</p>
                  </div>
                  <Calendar size={18} className="text-zinc-500" />
                </div>

                <div className="mt-4 space-y-3">
                  {!stats?.upcomingDeadlines || stats.upcomingDeadlines.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      No upcoming task deadlines found.
                    </div>
                  ) : (
                    stats.upcomingDeadlines.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => window.location.assign(`/tasks/${item.id}`)}
                        className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-3.5 card-hover cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{item.project}</p>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {item.due}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </TiltCard>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
