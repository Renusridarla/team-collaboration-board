import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectForm from '../components/ProjectForm';
import api from '../services/api';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [id]);

  const handleSubmit = async (payload) => {
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
      <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Edit project</h2>
          <p className="mt-1 text-sm text-zinc-400">Update project information and collaborators.</p>
        </div>
        {project ? <ProjectForm initialValues={project} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" error={error} /> : <p className="text-sm text-zinc-400">{error}</p>}
      </div>
    </DashboardLayout>
  );
}
