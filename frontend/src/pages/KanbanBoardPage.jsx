import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import KanbanColumn from '../components/KanbanColumn';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function KanbanBoardPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ assignedUser: '', priority: '', search: '' });

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/tasks/project/${projectId}`);
      setTasks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('tasksUpdated', handler);
    return () => window.removeEventListener('tasksUpdated', handler);
  }, [projectId]);

  const onEdit = (task) => navigate(`/tasks/${task._id}/edit`);
  const onDelete = async (task) => {
    const confirmed = window.confirm(`Delete task "${task.title}"?`);
    if (!confirmed) return;
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      await api.delete(`/tasks/${task._id}`);
      load();
      window.dispatchEvent(new Event('tasksUpdated'));
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete task');
    }
  };

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.assignedUser) {
        if (filters.assignedUser === 'me') {
          if (t.assignedTo?._id !== (localStorage.getItem('userId') || null)) return false;
        } else if (t.assignedTo?._id !== filters.assignedUser) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const columns = {
    'To Do': filtered.filter((t) => t.status === 'To Do'),
    'In Progress': filtered.filter((t) => t.status === 'In Progress'),
    Completed: filtered.filter((t) => t.status === 'Completed'),
  };

  if (loading) return <DashboardLayout title="Kanban Board"><LoadingSpinner /></DashboardLayout>;

  if (error) return (<DashboardLayout title="Kanban Board"><div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">{error}</div></DashboardLayout>);

  if (!tasks.length) return (<DashboardLayout title="Kanban Board"><EmptyState title="No tasks" description="No tasks for this project yet." action={null} /></DashboardLayout>);

  return (
    <DashboardLayout title="Kanban Board">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Kanban</h2>
            <p className="text-sm text-slate-400">Project tasks organized by status.</p>
          </div>
          <div className="flex gap-2">
            <input placeholder="Search title" value={filters.search} onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
            <select value={filters.priority} onChange={(e) => setFilters((s) => ({ ...s, priority: e.target.value }))} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
              <option value="">All priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <KanbanColumn title="To Do" tasks={columns['To Do']} onEdit={onEdit} onDelete={onDelete} onStatusChange={load} />
          <KanbanColumn title="In Progress" tasks={columns['In Progress']} onEdit={onEdit} onDelete={onDelete} onStatusChange={load} />
          <KanbanColumn title="Completed" tasks={columns['Completed']} onEdit={onEdit} onDelete={onDelete} onStatusChange={load} />
        </div>
      </div>
    </DashboardLayout>
  );
}
