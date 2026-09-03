import { useEffect, useState } from 'react';
import api from '../services/api';
import Activity from './Activity';

export default function ActivityTimeline({ projectId, limit = 0 }) {
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

  if (loading) return <div className="text-sm text-zinc-400">Loading activity...</div>;
  if (error) return <div className="text-sm text-zinc-400">{error}</div>;

  return (
    <div>
      {activities.map((a) => (
        <Activity key={a._id} item={a} />
      ))}
    </div>
  );
}
