import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

const priorityStyles = {
  High: 'bg-rose-500/15 text-rose-300',
  Medium: 'bg-amber-500/15 text-amber-300',
  Low: 'bg-emerald-500/15 text-emerald-300',
};

const statusStyles = {
  'To Do': 'bg-slate-700 text-slate-200',
  'In Progress': 'bg-cyan-500/15 text-cyan-300',
  Completed: 'bg-emerald-500/15 text-emerald-300',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [status, setStatus] = useState(task.status);

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value;
    setStatus(nextStatus);
    const token = localStorage.getItem('token');
    if (!token) return;

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: nextStatus });
      // notify parent and other parts of the app (dashboard, kanban)
      if (onStatusChange) onStatusChange();
      try { window.dispatchEvent(new Event('tasksUpdated')); } catch (e) {}
    } catch (error) {
      setStatus(task.status);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{task.projectId?.projectName || 'Project'}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{task.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
          {task.priority}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-400">{task.description || 'No description provided.'}</p>

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <span className={`rounded-full px-3 py-1 ${statusStyles[status] || statusStyles['To Do']}`}>{status}</span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{task.assignedTo?.name || 'Unassigned'}</span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select value={status} onChange={handleStatusChange} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <Link to={`/tasks/${task._id}`} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
          View
        </Link>
        <button onClick={() => onEdit(task)} className="rounded-lg bg-cyan-500/15 px-3 py-2 text-sm text-cyan-300 transition hover:bg-cyan-500/25">
          Edit
        </button>
        <button onClick={() => onDelete(task)} className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/25">
          Delete
        </button>
      </div>
    </div>
  );
}
