import { useState } from 'react';

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSubmit(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-md bg-slate-800 p-3 text-sm text-slate-100"
        placeholder="Write a comment..."
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-cyan-600 px-4 py-2 text-sm text-white"
        >
          Comment
        </button>
      </div>
    </form>
  );
}