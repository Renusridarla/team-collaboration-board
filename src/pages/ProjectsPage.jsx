import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/SkeletonLoader';
import ProjectList from '../components/ProjectList';
import Magnetic from '../components/Magnetic';
import { useProjects } from '../hooks/useProjects';
import { Plus } from 'lucide-react';

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Projects</h2>
            <p className="text-sm text-zinc-400">Browse and manage team collaboration projects</p>
          </div>
          <Magnetic strength={8}>
            <Link
              to="/projects/new"
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white shadow"
            >
              <Plus size={18} />
              <span>Create Project</span>
            </Link>
          </Magnetic>
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          <EmptyState
            title="No projects available"
            description="There are no projects created yet. Click 'Create Project' to get started."
            actionText="Create Project"
            onAction={() => navigate('/projects/new')}
          />
        ) : (
          <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </DashboardLayout>
  );
}
