import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function CalendarPage() {
  const [tasksByDate, setTasksByDate] = useState({});

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      const res = await api.get('/tasks');
      const tasks = res.data || [];
      const grouped = {};
      tasks.forEach((t) => {
        const key = t.deadline ? new Date(t.deadline).toISOString().slice(0, 10) : 'no-deadline';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(t);
      });
      setTasksByDate(grouped);
    } catch (e) {
      setTasksByDate({});
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('tasksUpdated', handler);
    return () => window.removeEventListener('tasksUpdated', handler);
  }, []);

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-lg font-semibold text-white">Calendar view</h2>
          <p className="text-sm text-slate-400">Tasks grouped by deadline date</p>
        </div>

        <div className="grid gap-4">
          {Object.keys(tasksByDate).length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">No tasks found.</div>
          )}

          {Object.entries(tasksByDate)
            .sort()
            .map(([date, items]) => (
              <div key={date} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{date === 'no-deadline' ? 'No deadline' : date}</h3>
                  <p className="text-sm text-slate-400">{items.length} task{items.length !== 1 ? 's' : ''}</p>
                </div>
                <ul className="mt-3 space-y-2">
                  {items.map((t) => (
                    <li key={t._id} className="rounded-md bg-slate-900/60 p-2">
                      <Link to={`/tasks/${t._id}`} className="text-sm text-cyan-300 hover:underline">
                        {t.title}
                      </Link>
                      <div className="text-xs text-slate-400">{t.status} — {t.priority || 'Normal'}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
