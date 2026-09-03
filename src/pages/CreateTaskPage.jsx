import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import TaskForm from '../components/TaskForm';
import api from '../services/api';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get('/projects').then((response) => setProjects(response.data)).catch(() => setProjects([]));
  }, []);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/tasks', payload);
      try { window.dispatchEvent(new Event('tasksUpdated')); } catch (e) {}
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create Task">
      <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create a new task</h2>
          <p className="mt-1 text-sm text-zinc-400">Break work into manageable action items for your team.</p>
        </div>
        <TaskForm projects={projects} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Task" error={error} />
      </div>
    </DashboardLayout>
  );
}
