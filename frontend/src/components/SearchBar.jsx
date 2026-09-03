import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ placeholder = 'Search projects, tasks, comments...' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
        setOpen(true);
      } catch (e) {
        setResults(null);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, []);

  const openResult = (type, id) => {
    setOpen(false);
    if (type === 'task') navigate(`/tasks/${id}`);
    if (type === 'project') navigate(`/projects/${id}`);
    if (type === 'comment') {
      navigate(`/tasks`);
    }
  };

  return (
    <div ref={ref} className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
        placeholder={placeholder}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white w-72 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
      />

      {open && results && (
        <div className="absolute z-50 mt-2 w-80 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
          <div className="space-y-2">
            {results.projects?.length > 0 && (
              <div>
                <div className="text-xs text-zinc-400 font-medium mb-1">Projects</div>
                {results.projects.slice(0,5).map(p => (
                  <div key={p._id} onClick={() => openResult('project', p._id)} className="cursor-pointer py-1 text-sm text-white hover:text-zinc-300">{p.projectName}</div>
                ))}
              </div>
            )}

            {results.tasks?.length > 0 && (
              <div>
                <div className="text-xs text-zinc-400 font-medium mb-1">Tasks</div>
                {results.tasks.slice(0,5).map(t => (
                  <div key={t._id} onClick={() => openResult('task', t._id)} className="cursor-pointer py-1 text-sm text-white hover:text-zinc-300">{t.title}</div>
                ))}
              </div>
            )}

            {results.comments?.length > 0 && (
              <div>
                <div className="text-xs text-zinc-400 font-medium mb-1">Comments</div>
                {results.comments.slice(0,5).map(c => (
                  <div key={c._id} className="py-1 text-sm text-zinc-300">{c.comment.slice(0,80)}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
