import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ProjectForm from '../components/ProjectForm';
import api from '../services/api';

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
      <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create a new project</h2>
          <p className="mt-1 text-sm text-zinc-400">Set up the project details and invite collaborators.</p>
        </div>
        {success ? (
          <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-200">
            {success}
          </div>
        ) : null}
        <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Project" error={error} />
      </div>
    </DashboardLayout>
  );
}
