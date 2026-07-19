import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Team Member' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(trimmedName, trimmedEmail, trimmedPassword, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-3xl bg-slate-800 shadow-2xl md:flex-row">
        <div className="flex-1 bg-gradient-to-br from-purple-500 to-fuchsia-600 p-10">
          <h1 className="text-3xl font-semibold">Create your workspace</h1>
          <p className="mt-3 text-sm text-purple-50">Start collaborating with your team in minutes.</p>
        </div>
        <div className="flex-1 p-8 sm:p-10">
          <h2 className="text-2xl font-semibold">Register</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 outline-none ring-0" required />
            </div>
            <div>
              <label className="mb-1 block text-sm">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 outline-none ring-0" required />
            </div>
            <div>
              <label className="mb-1 block text-sm">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 outline-none ring-0" required />
            </div>
            <div>
              <label className="mb-1 block text-sm">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 outline-none ring-0">
                <option value="Team Member">Team Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button className="w-full rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-cyan-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
