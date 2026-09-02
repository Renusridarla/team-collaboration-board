import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectForm from '../components/ProjectForm';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject({
          ...response.data,
          members: response.data.members?.map((member) => member.email).join(', ') || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

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
      await api.put(`/projects/${id}`, payload);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout title="Edit Project"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Edit Project">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Edit project</h2>
          <p className="mt-1 text-sm text-slate-400">Update project information and collaborators.</p>
        </div>
        {project ? <ProjectForm initialValues={project} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" error={error} /> : <p className="text-sm text-rose-400">{error}</p>}
      </div>
    </DashboardLayout>
  );
}
