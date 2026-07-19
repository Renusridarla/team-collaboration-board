import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function ActivityTimeline({ limit = 50 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setLoading(true);
    try {
      const res = await api.get(`/activity?limit=${limit}`);
      setActivities(res.data || []);
    } catch (e) {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('activityUpdated', handler);
    window.addEventListener('tasksUpdated', handler);
    return () => {
      window.removeEventListener('activityUpdated', handler);
      window.removeEventListener('tasksUpdated', handler);
    };
  }, [limit]);

  return (
    <div className="space-y-3">
      {loading && <div className="text-sm text-slate-400">Loading activity...</div>}
      {!loading && activities.length === 0 && <div className="text-sm text-slate-400">No recent activity.</div>}
      {!loading && activities.map((a) => (
        <div key={a._id} className="flex items-start gap-3 rounded-md border border-slate-800 bg-slate-900/60 p-3">
          <div className="h-9 w-9 flex-none items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300 font-semibold">{a.userId?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div>
            <div className="text-sm text-white">{a.description}</div>
            <div className="text-xs text-slate-400">{a.userId?.name} • {new Date(a.createdAt).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
