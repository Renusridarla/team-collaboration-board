import { useEffect, useState } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function CommentsSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setLoading(true);
    try {
      const res = await api.get(`/comments/task/${taskId}`);
      setComments(res.data || []);
    } catch (e) {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('activityUpdated', handler);
    return () => window.removeEventListener('activityUpdated', handler);
  }, [taskId]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
      <h3 className="text-lg font-semibold text-white">Comments</h3>
      <div className="mt-4 space-y-3">
        <CommentForm taskId={taskId} onAdded={load} />

        {loading && <div className="text-sm text-slate-400">Loading comments...</div>}

        {!loading && comments.length === 0 && <div className="text-sm text-slate-400">No comments yet.</div>}

        <div className="mt-3 space-y-3">
          {comments.map((c) => (
            <CommentCard key={c._id} comment={c} onUpdated={load} onDeleted={load} />
          ))}
        </div>
      </div>
    </div>
  );
}
