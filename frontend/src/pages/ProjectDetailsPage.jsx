import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load project details');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) return <DashboardLayout title="Project Details"><LoadingSpinner /></DashboardLayout>;

  if (error || !project) {
    return (
      <DashboardLayout title="Project Details">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 text-sm text-zinc-400">
          {error || 'Project not found.'}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Project Details">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider font-medium text-zinc-500">{project.workspaceName || 'Workspace'}</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{project.projectName}</h2>
          </div>
          <Link to="/projects" className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 btn-interaction hover:bg-zinc-800 hover:text-white">
            Back to projects
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white tracking-tight">Project information</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Description</p>
                <p className="mt-1">{project.description || 'No description provided.'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Workspace</p>
                <p className="mt-1">{project.workspaceName || 'Default Workspace'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Created by</p>
                <p className="mt-1">{project.createdBy?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Status</p>
                <p className="mt-1">{project.status}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Created date</p>
                <p className="mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white tracking-tight">Members</h3>
            <div className="mt-4 space-y-2">
              {project.members?.length ? project.members.map((member) => (
                <div key={member._id} className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                  {member.name} <span className="text-zinc-500">({member.email})</span>
                </div>
              )) : <p className="text-sm text-zinc-500">No members added yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
