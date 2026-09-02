import { useState } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';
import Magnetic from './Magnetic';
import api from '../services/api';
import { useToast } from './Toast';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [status, setStatus] = useState(task.status || 'To Do');
  const toast = useToast();

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value;
    setStatus(nextStatus);
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: nextStatus });
      toast.success(`Task status updated to ${nextStatus}`);
      if (onStatusChange) onStatusChange();
      try {
        window.dispatchEvent(new Event('tasksUpdated'));
      } catch (e) {}
    } catch (error) {
      setStatus(task.status);
      toast.error('Failed to update task status');
    }
  };

  return (
    <TiltCard className="group p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-zinc-400">{task.projectId?.projectName || 'Project'}</p>
            <h3 className="mt-1 text-lg font-semibold text-white tracking-tight">{task.title}</h3>
          </div>
          <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
            {task.priority || 'Medium'}
          </span>
        </div>

        <p className="mt-3 text-xs text-zinc-400 line-clamp-2">
          {task.description || 'No description provided.'}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-zinc-200">
            Status: {status}
          </span>
          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-zinc-400">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-zinc-400">
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
          </span>
        </div>
      </div>

      {/* Footer with Hover-Reveal Action Buttons */}
      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
        <select
          value={status}
          onChange={handleStatusChange}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-zinc-500 focus:outline-none"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            to={`/tasks/${task._id}`}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-200 btn-interaction hover:bg-zinc-700"
          >
            View
          </Link>
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-200 btn-interaction hover:bg-zinc-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-zinc-400 btn-interaction hover:text-zinc-100 hover:bg-zinc-800"
          >
            Delete
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
