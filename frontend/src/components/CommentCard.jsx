import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function CommentCard({ comment, onUpdated, onDeleted }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.comment);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!text.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setLoading(true);
    try {
      await api.put(`/comments/${comment._id}`, { comment: text.trim() });
      window.dispatchEvent(new Event('activityUpdated'));
      setEditing(false);
      if (onUpdated) onUpdated();
    } catch (e) {}
    setLoading(false);
  };

  const remove = async () => {
    if (!confirm('Delete this comment?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setLoading(true);
    try {
      await api.delete(`/comments/${comment._id}`);
      window.dispatchEvent(new Event('activityUpdated'));
      if (onDeleted) onDeleted();
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 flex-none items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300 font-semibold">
          {comment.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">{comment.userId?.name || 'User'}</div>
              <div className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
            {comment.userId?._id === user?.id && (
              <div className="flex items-center gap-2">
                {!editing && (
                  <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-white">Edit</button>
                )}
                <button onClick={remove} className="text-xs text-rose-400 hover:text-rose-300">Delete</button>
              </div>
            )}
          </div>

          <div className="mt-2 text-sm text-slate-200">
            {editing ? (
              <>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-md bg-slate-800/60 p-2 text-sm text-slate-100" rows={3} />
                <div className="mt-2 flex gap-2">
                  <button onClick={save} disabled={loading} className="rounded-md bg-cyan-600 px-3 py-1 text-xs text-white">{loading ? 'Saving...' : 'Save'}</button>
                  <button onClick={() => { setEditing(false); setText(comment.comment); }} className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300">Cancel</button>
                </div>
              </>
            ) : (
              <div>{comment.comment}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
