import { useState } from 'react';

export default function CommentCard({
  comment,
  onDeleted,
  onUpdated,
  currentUserId,
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.comment);

  const isOwner =
    comment.userId && comment.userId._id
      ? comment.userId._id === currentUserId
      : comment.userId === currentUserId;

  return (
    <div className="py-3 border-b border-slate-800 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white">
            {comment.userId?.name || 'User'}
          </div>

          <div className="mt-1 text-slate-300">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2 text-slate-400">
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>

            <button
              onClick={() => onDeleted(comment._id)}
              className="text-xs text-rose-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 text-slate-200">
        {editing ? (
          <div className="space-y-2">
            <textarea
              className="w-full rounded-md bg-slate-800 p-2 text-sm text-slate-100"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setText(comment.comment);
                }}
                className="rounded-md bg-slate-700 px-3 py-1 text-xs"
              >
                Cancel
              </button>

              <button
                onClick={() => onUpdated(comment._id, text)}
                className="rounded-md bg-cyan-600 px-3 py-1 text-xs"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>{comment.comment}</div>
        )}
      </div>
    </div>
  );
}