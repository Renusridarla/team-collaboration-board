import { useEffect, useState } from 'react';
import api from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const [tasksResponse, projectsResponse] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
      ]);
      setTasks(tasksResponse.data || []);
      setProjects(projectsResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return { tasks, projects, loading, error, success, setSuccess, setError, loadTasks };
}
