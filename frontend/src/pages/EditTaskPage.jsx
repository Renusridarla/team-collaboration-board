import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskForm from '../components/TaskForm';
import api from '../services/api';

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskResponse, projectsResponse] = await Promise.all([api.get(`/tasks/${id}`), api.get('/projects')]);
        setTask({
          ...taskResponse.data,
          deadline: taskResponse.data.deadline ? taskResponse.data.deadline.slice(0, 10) : '',
          assignedTo: taskResponse.data.assignedTo?._id || '',
          projectId: taskResponse.data.projectId?._id || '',
        });
        setProjects(projectsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load task');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError('');

    try {
      await api.put(`/tasks/${id}`, payload);
      try { window.dispatchEvent(new Event('tasksUpdated')); } catch (e) {}
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout title="Edit Task"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Edit Task">
      <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Edit task</h2>
          <p className="mt-1 text-sm text-zinc-400">Adjust task details and keep delivery on track.</p>
        </div>
        {task ? <TaskForm initialValues={task} projects={projects} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" error={error} /> : <p className="text-sm text-zinc-400">{error}</p>}
      </div>
    </DashboardLayout>
  );
}
