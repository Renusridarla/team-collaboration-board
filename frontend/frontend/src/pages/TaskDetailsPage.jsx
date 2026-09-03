import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import CommentsSection from '../components/CommentsSection';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const loadTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load task');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, navigate]);

  if (loading) return <DashboardLayout title="Task Details"><LoadingSpinner /></DashboardLayout>;

  if (error || !task) {
    return (
      <DashboardLayout title="Task Details">
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">{error || 'Task not found.'}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Task Details">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{task.projectId?.projectName || 'Project'}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{task.title}</h2>
          </div>
          <Link to="/tasks" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
            Back to tasks
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <h3 className="text-lg font-semibold text-white">Task information</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>
                <p className="text-slate-400">Description</p>
                <p className="mt-1">{task.description || 'No description provided.'}</p>
              </div>
              <div>
                <p className="text-slate-400">Project</p>
                <p className="mt-1">{task.projectId?.projectName || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-slate-400">Assigned user</p>
                <p className="mt-1">{task.assignedTo?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-slate-400">Priority</p>
                <p className="mt-1">{task.priority}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <p className="mt-1">{task.status}</p>
              </div>
              <div>
                <p className="text-slate-400">Deadline</p>
                <p className="mt-1">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <h3 className="text-lg font-semibold text-white">Additional details</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>
                <p className="text-slate-400">Created by</p>
                <p className="mt-1">{task.createdBy?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-slate-400">Created date</p>
                <p className="mt-1">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
          <CommentsSection taskId={id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
