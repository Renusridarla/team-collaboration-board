import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectList from '../components/ProjectList';
import { useProjects } from '../hooks/useProjects';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, error, success, setSuccess, setError, loadProjects } = useProjects();

  const handleEdit = (project) => {
    navigate(`/projects/${project._id}/edit`);
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(`Delete project “${project.projectName}”?`);
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      await api.delete(`/projects/${project._id}`);
      setSuccess('Project deleted successfully.');
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete project');
    }
  };

  return (
    <DashboardLayout title="Projects">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Projects</h2>
          <p className="text-sm text-slate-400">Browse the projects you have access to.</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        ) : null}

        {loading ? (
          <LoadingSpinner />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects available"
            description="There are no projects to display yet. Check back after projects are created."
          />
        ) : (
          <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </DashboardLayout>
  );
}
