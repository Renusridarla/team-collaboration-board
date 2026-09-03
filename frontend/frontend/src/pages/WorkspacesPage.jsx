import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import EmptyState from '../components/EmptyState';
import TiltCard from '../components/TiltCard';
import Magnetic from '../components/Magnetic';
import { CardSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { Building2, Plus, Users, ArrowRight } from 'lucide-react';

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/workspaces');
      setWorkspaces(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/workspaces', { name: name.trim(), description: description.trim() });
      toast.success(`Workspace "${name.trim()}" created successfully!`);
      setName('');
      setDescription('');
      setShowModal(false);
      fetchWorkspaces();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create workspace';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Workspaces">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Workspaces</h2>
            <p className="text-sm text-zinc-400">Manage collaboration environments and team projects</p>
          </div>
          <Magnetic strength={8}>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white shadow"
            >
              <Plus size={18} />
              <span>Create Workspace</span>
            </button>
          </Magnetic>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-400">
            <p>{error}</p>
            <button
              onClick={fetchWorkspaces}
              className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white btn-interaction hover:bg-zinc-700"
            >
              Retry
            </button>
          </div>
        ) : workspaces.length === 0 ? (
          <EmptyState
            title="No workspaces yet"
            description="Create your first workspace to collaborate with your team and manage projects."
            actionText="Create Workspace"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <TiltCard
                key={ws._id}
                onClick={() => navigate(`/workspaces/${ws._id}`)}
                className="group p-5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200">
                      <Building2 size={20} />
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400">
                      {ws.owner?._id ? (ws.owner.name || 'Owner') : 'Workspace'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-zinc-100 tracking-tight">
                    {ws.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                    {ws.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-zinc-500" />
                      {ws.members?.length || 1} members
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-zinc-300 font-medium group-hover:translate-x-0.5 transition-transform">
                    Open <ArrowRight size={14} />
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>

      {/* Modal with scale-in transition */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-1">Create Workspace</h3>
            <p className="text-xs text-zinc-400 mb-5">Set up a workspace for team collaboration</p>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Workspace Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering Team, Marketing Operations"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Optional details about this workspace"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 btn-interaction hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
