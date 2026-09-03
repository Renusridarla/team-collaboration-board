import { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { MessageSquare } from 'lucide-react';

export default function CommentsSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadComments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/comments/task/${taskId}`);
      setComments(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) loadComments();
  }, [taskId]);

  const addComment = async (text) => {
    try {
      await api.post('/comments', { taskId, comment: text });
      await loadComments();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add comment');
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments((c) => c.filter((x) => x._id !== id));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete comment');
    }
  };

  const updateComment = async (id, text) => {
    try {
      await api.put(`/comments/${id}`, { comment: text });
      await loadComments();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update comment');
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl space-y-4">
      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
        <MessageSquare size={18} className="text-zinc-400" /> Comments ({comments.length})
      </h3>

      <CommentForm onSubmit={addComment} />

      <div className="mt-4">
        {loading && <div className="text-xs text-zinc-400 py-4 text-center">Loading comments...</div>}
        {error && <div className="text-xs text-zinc-300 py-2">{error}</div>}
        {!loading && comments.length === 0 && (
          <div className="text-xs text-zinc-500 py-4 text-center">No comments yet. Start the conversation!</div>
        )}
        <div className="mt-4 space-y-3">
          {comments.map((c) => (
            <CommentCard
              key={c._id}
              comment={c}
              onDeleted={deleteComment}
              onUpdated={updateComment}
              currentUserId={user?._id || user?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
