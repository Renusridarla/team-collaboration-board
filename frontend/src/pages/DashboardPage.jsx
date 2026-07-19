import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { dashboardStats, deadlines } from '../data/dashboardData';
import axios from 'axios';
import ActivityTimeline from '../components/ActivityTimeline';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: 'Total Tasks', value: 0, change: '' },
    { title: 'Completed Tasks', value: 0, change: '' },
    { title: 'Pending Tasks', value: 0, change: '' },
    { title: 'Overdue Tasks', value: 0, change: '' },
    { title: 'Open Projects', value: dashboardStats[4].value, change: dashboardStats[4].change },
  ]);

  const loadStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      const response = await api.get('/tasks');
      const tasks = response.data || [];
      const total = tasks.length;
      const completed = tasks.filter((t) => t.status === 'Completed').length;
      const pending = tasks.filter((t) => t.status !== 'Completed').length;
      const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Completed').length;

      setStats([
        { title: 'Total Tasks', value: total, change: '' },
        { title: 'Completed Tasks', value: completed, change: '' },
        { title: 'Pending Tasks', value: pending, change: '' },
        { title: 'Overdue Tasks', value: overdue, change: '' },
        { title: 'Open Projects', value: dashboardStats[4].value, change: dashboardStats[4].change },
      ]);
    } catch (err) {
      // keep defaults on error
    }
  };

  useEffect(() => {
    loadStats();
    const handler = () => loadStats();
    window.addEventListener('tasksUpdated', handler);
    return () => window.removeEventListener('tasksUpdated', handler);
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Recent activity</h2>
                <p className="text-sm text-slate-400">Updates from your team</p>
              </div>
              <button onClick={() => window.location.assign('/activity')} className="text-sm font-medium text-cyan-400">View all</button>
            </div>
            <div className="mt-5 space-y-3">
              <ActivityTimeline limit={10} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Today's deadlines</h2>
                <p className="text-sm text-slate-400">Priority items for today</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {deadlines.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-3">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-cyan-300">{item.due}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
