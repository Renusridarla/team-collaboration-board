import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskForm from '../components/TaskForm';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
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
  }, [id, navigate]);

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setIsSubmitting(true);
    setError('');

    try {
      await api.put(`/tasks/${id}`, payload);
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
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Edit task</h2>
          <p className="mt-1 text-sm text-slate-400">Adjust task details and keep delivery on track.</p>
        </div>
        {task ? <TaskForm initialValues={task} projects={projects} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" error={error} /> : <p className="text-sm text-rose-400">{error}</p>}
      </div>
    </DashboardLayout>
  );
}
