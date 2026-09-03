import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import api from '../services/api';

export default function TasksPage() {
  const navigate = useNavigate();
  const { tasks, projects, loading, error, success, setSuccess, setError, loadTasks } = useTasks();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({ status: '', priority: '', project: '', assignedUser: '' });

  useEffect(() => {
    if (success) {
      const timer = window.setTimeout(() => setSuccess(''), 2500);
      return () => window.clearTimeout(timer);
    }
  }, [success, setSuccess]);

  const filteredTasks = useMemo(() => {
    const list = tasks.filter((task) => {
      const query = search.toLowerCase();
      const matchesQuery = !query || task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query);
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesProject = !filters.project || task.projectId?.projectName === filters.project;
      const matchesAssigned = !filters.assignedUser || (filters.assignedUser === 'me' ? task.assignedTo?._id : true);
      return matchesQuery && matchesStatus && matchesPriority && matchesProject && matchesAssigned;
    });

    return list.sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31');
      if (sortBy === 'priority') {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, search, filters, sortBy]);

  const handleDelete = async (task) => {
    const confirmed = window.confirm(`Delete ${task.title}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      setSuccess('Task deleted successfully');
      try { window.dispatchEvent(new Event('tasksUpdated')); } catch (e) {}
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task');
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <DashboardLayout title="Tasks">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Tasks</h2>
            <p className="text-sm text-zinc-400">Manage work across your projects.</p>
          </div>
          <Link to="/tasks/new" className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white">
            Create task
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="mt-4">
            <TaskFilters filters={filters} onFilterChange={handleFilterChange} onClear={() => setFilters({ status: '', priority: '', project: '', assignedUser: '' })} />
          </div>
        </div>

        {error ? <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-200">{error}</div> : null}
        {success ? <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-200">{success}</div> : null}

        {loading ? <LoadingSpinner /> : filteredTasks.length === 0 ? <EmptyState title="No tasks found" description="Create a new task or adjust your filters." action={<Link to="/tasks/new" className="rounded-lg bg-zinc-100 px-4 py-2 font-semibold text-zinc-950">Create Task</Link>} /> : <TaskList tasks={filteredTasks} onEdit={(task) => navigate(`/tasks/${task._id}/edit`)} onDelete={handleDelete} onStatusChange={loadTasks} />}
      </div>
    </DashboardLayout>
  );
}
