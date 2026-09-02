import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/profile')
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: loggedInUser } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(msg);
    }
  };

  const register = async (name, email, password, role = 'Team Member') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token: newToken, user: registeredUser } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(registeredUser);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
