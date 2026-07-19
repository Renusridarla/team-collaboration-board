import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ProjectForm from '../components/ProjectForm';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timeout;
    if (success) {
      timeout = window.setTimeout(() => navigate('/projects'), 1200);
    }
    return () => window.clearTimeout(timeout);
  }, [success, navigate]);

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/projects', payload);
      setSuccess('Project created successfully. Redirecting to projects...');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create Project">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Create a new project</h2>
          <p className="mt-1 text-sm text-slate-400">Set up the project details and invite collaborators.</p>
        </div>
        {success ? (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        ) : null}
        <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Project" error={error} />
      </div>
    </DashboardLayout>
  );
}
