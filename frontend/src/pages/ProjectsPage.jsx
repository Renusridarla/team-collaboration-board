import { useNavigate } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectList from '../components/ProjectList';
import { useProjects } from '../hooks/useProjects';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, error, success, setSuccess, setError, loadProjects } = useProjects();

  const handleEdit = (project) => {
    navigate(`/projects/${project._id}/edit`);
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(`Delete project "${project.projectName}"?`);
    if (!confirmed) return;

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
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Projects</h2>
          <p className="text-sm text-zinc-400">Browse the projects you have access to.</p>
        </div>

        {error ? (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-200">
            {success}
          </div>
        ) : null}

        {loading ? (
          <LoadingSpinner />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects available"
            description="There are no projects to display yet. Create a workspace or project to get started."
          />
        ) : (
          <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </DashboardLayout>
  );
}
