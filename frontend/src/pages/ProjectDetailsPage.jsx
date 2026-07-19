import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load project details');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  if (loading) return <DashboardLayout title="Project Details"><LoadingSpinner /></DashboardLayout>;

  if (error || !project) {
    return (
      <DashboardLayout title="Project Details">
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">
          {error || 'Project not found.'}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Project Details">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{project.workspaceName || 'Workspace'}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{project.projectName}</h2>
          </div>
          <Link to="/projects" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
            Back to projects
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <h3 className="text-lg font-semibold text-white">Project information</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>
                <p className="text-slate-400">Description</p>
                <p className="mt-1">{project.description || 'No description provided.'}</p>
              </div>
              <div>
                <p className="text-slate-400">Workspace</p>
                <p className="mt-1">{project.workspaceName || 'Default Workspace'}</p>
              </div>
              <div>
                <p className="text-slate-400">Created by</p>
                <p className="mt-1">{project.createdBy?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <p className="mt-1">{project.status}</p>
              </div>
              <div>
                <p className="text-slate-400">Created date</p>
                <p className="mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <h3 className="text-lg font-semibold text-white">Members</h3>
            <div className="mt-4 space-y-2">
              {project.members?.length ? project.members.map((member) => (
                <div key={member._id} className="rounded-2xl border border-slate-800 bg-slate-800/70 px-3 py-2 text-sm text-slate-300">
                  {member.name} <span className="text-slate-400">({member.email})</span>
                </div>
              )) : <p className="text-sm text-slate-400">No members added yet.</p>}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
          <h3 className="text-lg font-semibold text-white">Future tasks</h3>
          <p className="mt-2 text-sm text-slate-400">Task management will be added in a future step.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
