import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import KanbanColumn from '../components/KanbanColumn';
import api from '../services/api';
import { LayoutGrid, ArrowLeft } from 'lucide-react';

export default function KanbanBoardPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ priority: '', search: '' });

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/tasks/project/${projectId}`);
      setTasks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load kanban board tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const handler = () => loadTasks();
    window.addEventListener('tasksUpdated', handler);
    return () => window.removeEventListener('tasksUpdated', handler);
  }, [projectId]);

  const onEdit = (task) => navigate(`/tasks/${task._id}/edit`);

  const onDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      loadTasks();
      try {
        window.dispatchEvent(new Event('tasksUpdated'));
      } catch (e) {}
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete task');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const columns = {
    'To Do': filteredTasks.filter((t) => t.status === 'To Do' || t.status === 'TODO'),
    'In Progress': filteredTasks.filter((t) => t.status === 'In Progress' || t.status === 'IN_PROGRESS'),
    Completed: filteredTasks.filter((t) => t.status === 'Completed' || t.status === 'COMPLETED'),
  };

  return (
    <DashboardLayout title="Kanban Board">
      <div className="space-y-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back to Project Details
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <LayoutGrid size={22} className="text-zinc-400" /> Task Board
            </h2>
            <p className="text-sm text-zinc-400">Manage tasks by status workflow</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Filter tasks..."
              value={filters.search}
              onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
            />
            <select
              value={filters.priority}
              onChange={(e) => setFilters((s) => ({ ...s, priority: e.target.value }))}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-zinc-600 focus:outline-none"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex py-16 justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-400">
            <p>{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks in project"
            description="Create your first task for this project to start tracking work on the Kanban board."
            actionText="Create Task"
            onAction={() => navigate('/tasks/new', { state: { projectId } })}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <KanbanColumn
                title="TODO"
                tasks={columns['To Do']}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={loadTasks}
              />
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <KanbanColumn
                title="IN PROGRESS"
                tasks={columns['In Progress']}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={loadTasks}
              />
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <KanbanColumn
                title="COMPLETED"
                tasks={columns['Completed']}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={loadTasks}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
