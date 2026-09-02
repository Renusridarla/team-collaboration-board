import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { Users, Mail, Check, X, UserPlus, Building2 } from 'lucide-react';

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const toast = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, wsRes, invRes] = await Promise.allSettled([
        api.get('/auth/users'),
        api.get('/workspaces'),
        api.get('/invitations'),
      ]);

      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || []);
      if (wsRes.status === 'fulfilled') {
        const ws = wsRes.value.data || [];
        setWorkspaces(ws);
        if (ws.length > 0 && !selectedWorkspace) {
          setSelectedWorkspace(ws[0]._id);
        }
      }
      if (invRes.status === 'fulfilled') setInvitations(invRes.value.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!selectedWorkspace || !inviteEmail.trim()) return;

    try {
      setInviting(true);
      const res = await api.post(`/workspaces/${selectedWorkspace}/invite`, { email: inviteEmail.trim() });
      toast.success(res.data?.message || 'Member added to workspace successfully!');
      setInviteEmail('');
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send invite';
      toast.error(errorMsg);
    } finally {
      setInviting(false);
    }
  };

  const handleRespondInvitation = async (invitationId, action) => {
    try {
      await api.post(`/invitations/${invitationId}/respond`, { action });
      toast.success(`Invitation ${action}ed successfully`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond to invitation');
    }
  };

  return (
    <DashboardLayout title="Team & Invitations">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Team Collaboration</h2>
            <p className="text-sm text-zinc-400">View team members and pending workspace invitations</p>
          </div>
        </div>

        {loading ? (
          <div className="flex py-16 justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Invite Form Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <UserPlus size={18} className="text-zinc-400" /> Invite Team Member
              </h3>
              <p className="text-xs text-zinc-400 mb-4">Add a registered user to your workspace by email</p>

              <form onSubmit={handleSendInvite} className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Target Workspace</label>
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-zinc-500 focus:outline-none"
                  >
                    {workspaces.map((ws) => (
                      <option key={ws._id} value={ws._id}>
                        {ws.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">User Email</label>
                  <input
                    type="email"
                    required
                    placeholder="teammate@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={inviting || !selectedWorkspace || !inviteEmail.trim()}
                    className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white disabled:opacity-50"
                  >
                    {inviting ? 'Inviting...' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>

            {/* Pending Invitations Section */}
            {invitations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail size={18} className="text-zinc-400" /> Pending Invitations ({invitations.length})
                </h3>

                <div className="space-y-3">
                  {invitations.map((inv) => (
                    <div
                      key={inv._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow card-hover"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Workspace: {inv.workspaceId?.name || 'Workspace'}
                          </p>
                          <p className="text-xs text-zinc-400">
                            Invited by <strong className="text-zinc-300">{inv.inviter?.name}</strong> ({inv.inviter?.email})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRespondInvitation(inv._id, 'accept')}
                          className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 btn-interaction hover:bg-white"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleRespondInvitation(inv._id, 'reject')}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-300 btn-interaction hover:bg-zinc-800"
                        >
                          <X size={14} /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members Directory */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={18} className="text-zinc-400" /> Registered Users & Team Directory ({users.length})
              </h3>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 divide-y divide-zinc-800/80 shadow-xl overflow-hidden">
                {users.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400">No registered users found.</div>
                ) : (
                  users.map((u) => (
                    <div key={u._id} className="flex items-center justify-between p-4 hover:bg-zinc-900 transition">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 font-semibold text-zinc-200">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{u.name}</p>
                          <p className="text-xs text-zinc-400">{u.email}</p>
                        </div>
                      </div>

                      <span className="text-xs px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400">
                        {u.role || 'Team Member'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
