import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both your email and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(trimmedEmail, trimmedPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-3xl bg-slate-800 shadow-2xl md:flex-row">
        <div className="flex-1 bg-gradient-to-br from-cyan-500 to-blue-600 p-10">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-3 text-sm text-cyan-50">Sign in to manage your team and projects.</p>
        </div>
        <div className="flex-1 p-8 sm:p-10">
          <h2 className="text-2xl font-semibold">Login</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                }}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 outline-none ring-0"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError('');
                }}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 outline-none ring-0"
                required
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button
              className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-300">
            Need an account?{' '}
            <Link to="/register" className="font-medium text-cyan-400">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
