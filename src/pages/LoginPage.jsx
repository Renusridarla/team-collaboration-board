import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomCursor from '../components/CustomCursor';
import Magnetic from '../components/Magnetic';

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
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(trimmedEmail, trimmedPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed: Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 text-zinc-100 overflow-hidden font-sans">
      <CustomCursor />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-zinc-800/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        <div className="text-center space-y-2">
          <Magnetic strength={6}>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-lg shadow-lg">
              TC
            </div>
          </Magnetic>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to Team Board</h1>
          <p className="text-xs text-zinc-400">Enter your credentials to access your workspace</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl space-y-4">
          {error && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-xs text-zinc-200 animate-scale-in">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                required
              />
            </div>

            <Magnetic strength={8} className="w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 btn-interaction hover:bg-white disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </Magnetic>
          </form>

          <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-800">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-white underline hover:text-zinc-300">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
