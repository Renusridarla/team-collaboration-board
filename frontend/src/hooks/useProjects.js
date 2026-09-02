import { useEffect, useState } from 'react';
import api from '../services/api';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/projects');
      setProjects(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return { projects, loading, error, success, setSuccess, setError, loadProjects };
}
