import { useEffect, useState } from 'react';
import axios from 'axios';
import Activity from './Activity';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function ActivityTimeline({ projectId, limit = 0 }) {
  const token = localStorage.getItem('token');
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = projectId ? `/activity/project/${projectId}` : '/activity';
        const res = await api.get(url + (limit ? `?limit=${limit}` : ''));
        setActivities(res.data || []);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId, limit]);

  if (loading) return <div className="text-sm text-slate-400">Loading activity...</div>;
  if (error) return <div className="text-sm text-rose-400">{error}</div>;

  return (
    <div>
      {activities.map((a) => (
        <Activity key={a._id} item={a} />
      ))}
    </div>
  );
}
