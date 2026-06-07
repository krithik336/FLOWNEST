import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-12 sm:px-6 lg:px-8">
      {/* Glow Effect in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and title info */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/15 border border-brand-accent/30 shadow-lg shadow-brand-accent/10">
            <svg className="h-7 w-7 text-brand-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 16.97 3 12a9 9 0 0 1 6.36-8.58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
              <path d="M12 6a6 6 0 0 1 6 6c0 3.31-2.69 6-6 6s-6-2.69-6-6a6 6 0 0 1 4.24-5.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
              <path d="M12 9a3 3 0 0 1 3 3c0 1.66-1.34 3-3 3s-3-1.34-3-3a3 3 0 0 1 2.12-2.86" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.5" className="fill-brand-accent animate-ping" />
              <circle cx="12" cy="12" r="1" className="fill-brand-accent" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-brand-text font-display">
            Welcome back to <span className="text-brand-accent">FlowNest</span>
          </h2>
          <p className="mt-2 text-sm text-brand-text/60">
            Enter your credentials to access your workspaces
          </p>
        </div>

        {/* Login form panel */}
        <div className="bg-brand-surface border border-brand-border/60 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/50 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text/30">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 py-3 pl-10 pr-3 text-brand-text placeholder-brand-text/30 outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/50 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text/30">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 py-3 pl-10 pr-3 text-brand-text placeholder-brand-text/30 outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-brand-accent px-4 py-3.5 text-sm font-semibold text-brand-bg hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 focus:ring-offset-brand-bg transition-all shadow-lg shadow-brand-accent/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <LogIn className="h-5 w-5 mr-2" />
                )}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Direct to registration */}
          <div className="mt-6 text-center text-sm">
            <span className="text-brand-text/55">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-brand-accent hover:text-brand-accent/80 transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
