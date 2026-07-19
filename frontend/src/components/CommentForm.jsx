import { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function CommentForm({ taskId, onAdded }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setLoading(true);
    try {
      await api.post('/comments', { taskId, comment: text.trim() });
      setText('');
      window.dispatchEvent(new Event('activityUpdated'));
      if (onAdded) onAdded();
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-200"
        placeholder="Write a comment..."
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}
