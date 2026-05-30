import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Backend unavailable. Please try again later.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Wrong password or email not registered.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column - Branding / Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            TeenSpend Pro
          </h1>
        </div>
        <div className="max-w-md">
          <SparklesIcon className="w-12 h-12 mb-6 text-white/80" />
          <h2 className="text-4xl font-bold mb-4 leading-tight">Master your money.</h2>
          <p className="text-lg text-primary-100 opacity-90 leading-relaxed">
            The professional financial operating system built to help you track, analyze, and optimize your spending with absolute clarity.
          </p>
        </div>
        <div className="text-sm opacity-60 font-medium">
          © {new Date().getFullYear()} TeenSpend Pro. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <h1 className="text-2xl font-bold text-primary tracking-tight">TeenSpend Pro</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-text-main mb-2">Welcome back</h2>
          <p className="text-text-secondary mb-8">Log in to your dashboard to continue.</p>

          {error && (
            <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm mb-6 font-semibold flex items-center gap-2 border border-danger/20">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Email address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-text-main">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary font-semibold hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 mt-4 text-base"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;