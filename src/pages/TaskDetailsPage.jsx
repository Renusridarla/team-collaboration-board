import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import CommentsSection from '../components/CommentsSection';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, [id]);

  if (loading) return <DashboardLayout title="Task Details"><LoadingSpinner /></DashboardLayout>;

  if (error || !task) {
    return (
      <DashboardLayout title="Task Details">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 text-sm text-zinc-400">{error || 'Task not found.'}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Task Details">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider font-medium text-zinc-500">{task.projectId?.projectName || 'Project'}</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{task.title}</h2>
          </div>
          <Link to="/tasks" className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 btn-interaction hover:bg-zinc-800 hover:text-white">
            Back to tasks
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white tracking-tight">Task information</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Description</p>
                <p className="mt-1">{task.description || 'No description provided.'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Project</p>
                <p className="mt-1">{task.projectId?.projectName || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Assigned user</p>
                <p className="mt-1">{task.assignedTo?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Priority</p>
                <p className="mt-1">{task.priority}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Status</p>
                <p className="mt-1">{task.status}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Deadline</p>
                <p className="mt-1">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white tracking-tight">Additional details</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Created by</p>
                <p className="mt-1">{task.createdBy?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Created date</p>
                <p className="mt-1">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
          <CommentsSection taskId={id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
