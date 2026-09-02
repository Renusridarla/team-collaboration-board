import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import TaskForm from '../components/TaskForm';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get('/projects').then((response) => setProjects(response.data)).catch(() => setProjects([]));
  }, [navigate]);

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/tasks', payload);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create Task">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Create a new task</h2>
          <p className="mt-1 text-sm text-slate-400">Break work into manageable action items for your team.</p>
        </div>
        <TaskForm projects={projects} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Task" error={error} />
      </div>
    </DashboardLayout>
  );
}
