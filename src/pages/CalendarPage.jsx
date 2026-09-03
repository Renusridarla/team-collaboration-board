import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function CalendarPage() {
  const [tasksByDate, setTasksByDate] = useState({});

  const load = async () => {
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
      <div className="space-y-4 animate-fade-in">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <h2 className="text-lg font-semibold text-white tracking-tight">Calendar view</h2>
          <p className="text-sm text-zinc-400">Tasks grouped by deadline date</p>
        </div>

        <div className="grid gap-4">
          {Object.keys(tasksByDate).length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-400">No tasks found.</div>
          )}

          {Object.entries(tasksByDate)
            .sort()
            .map(([date, items]) => (
              <div key={date} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{date === 'no-deadline' ? 'No deadline' : date}</h3>
                  <p className="text-sm text-zinc-400">{items.length} task{items.length !== 1 ? 's' : ''}</p>
                </div>
                <ul className="mt-3 space-y-2">
                  {items.map((t) => (
                    <li key={t._id} className="rounded-lg bg-zinc-950 p-3 border border-zinc-800/80">
                      <Link to={`/tasks/${t._id}`} className="text-sm font-medium text-white hover:text-zinc-300">
                        {t.title}
                      </Link>
                      <div className="text-xs text-zinc-400 mt-1">{t.status} — {t.priority || 'Normal'}</div>
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
