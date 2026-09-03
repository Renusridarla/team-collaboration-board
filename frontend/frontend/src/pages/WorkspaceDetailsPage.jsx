import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { Building2, Users, FolderKanban, Plus, UserPlus, Trash2, ArrowLeft } from 'lucide-react';

export default function WorkspaceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/workspaces/${id}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setInviting(true);
      const res = await api.post(`/workspaces/${id}/invite`, { email: inviteEmail.trim() });
      toast.success(res.data?.message || 'Member added to workspace!');
      setInviteEmail('');
      setShowInviteModal(false);
      fetchWorkspace();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to invite user';
      toast.error(errorMsg);
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member from the workspace?')) return;
    try {
      await api.delete(`/workspaces/${id}/members/${userId}`);
      toast.success('Member removed from workspace');
      fetchWorkspace();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Workspace Details">
        <div className="flex py-16 justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout title="Workspace Details">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-400">
          <p>{error || 'Workspace not found'}</p>
          <button
            onClick={() => navigate('/workspaces')}
            className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white btn-interaction hover:bg-zinc-700"
          >
            Back to Workspaces
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { workspace, projects } = data;

  return (
    <DashboardLayout title={workspace.name}>
      <div className="space-y-6">
        {/* Top bar navigation */}
        <button
          onClick={() => navigate('/workspaces')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition btn-interaction"
        >
          <ArrowLeft size={16} /> Back to Workspaces
        </button>

        {/* Workspace Header Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{workspace.name}</h1>
                <p className="text-sm text-zinc-400 mt-1">{workspace.description || 'No description'}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-400">
                  <span>Owner: <strong className="text-zinc-200">{workspace.owner?.name || 'Unknown'}</strong></span>
                  <span>Created: <strong className="text-zinc-200">{new Date(workspace.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white btn-interaction hover:bg-zinc-700"
              >
                <UserPlus size={16} />
                <span>Invite Member</span>
              </button>
              <button
                onClick={() => navigate('/projects/new', { state: { workspaceName: workspace.name, workspaceId: workspace._id } })}
                className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white"
              >
                <Plus size={16} />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FolderKanban size={18} className="text-zinc-400" /> Projects ({projects.length})
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
              <p>No projects in this workspace yet.</p>
              <button
                onClick={() => navigate('/projects/new', { state: { workspaceName: workspace.name, workspaceId: workspace._id } })}
                className="mt-3 text-sm font-medium text-white underline hover:text-zinc-300"
              >
                Create the first project
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg card-hover cursor-pointer"
                >
                  <h3 className="font-semibold text-white tracking-tight">{p.projectName}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{p.description || 'No description'}</p>
                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                    <span>Status: <strong className="text-zinc-200">{p.status}</strong></span>
                    <span>{p.members?.length || 0} members</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users size={18} className="text-zinc-400" /> Workspace Members ({workspace.members?.length || 0})
            </h2>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 divide-y divide-zinc-800/80 shadow-lg">
            {workspace.members?.map((m) => {
              const isOwner = workspace.owner?._id === m._id;
              return (
                <div key={m._id} className="flex items-center justify-between p-4 hover:bg-zinc-900/90 transition">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 font-semibold text-zinc-200">
                      {m.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{m.name}</p>
                      <p className="text-xs text-zinc-400">{m.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400">
                      {isOwner ? 'Workspace Owner' : (m.role || 'Member')}
                    </span>
                    {!isOwner && (
                      <button
                        onClick={() => handleRemoveMember(m._id)}
                        className="text-zinc-500 hover:text-white p-1 btn-interaction"
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-1">Invite Member</h3>
            <p className="text-xs text-zinc-400 mb-5">Enter registered user email to add them to {workspace.name}</p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">User Email *</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 btn-interaction hover:bg-zinc-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white disabled:opacity-50"
                >
                  {inviting ? 'Inviting...' : 'Send Invite / Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
