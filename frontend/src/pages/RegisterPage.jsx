import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setError('Please fill all fields');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);

      await register({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      });

      navigate('/login');
    } catch (err) {
      console.error(err);

      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Backend unavailable. Please try again later.');
      } else {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Registration failed'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            TeenSpend Pro
          </h1>
        </div>

        <div className="max-w-md">
          <SparklesIcon className="w-12 h-12 mb-6 text-white/80" />

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Start your journey.
          </h2>

          <p className="text-lg text-primary-100 opacity-90 leading-relaxed">
            Join thousands of users who have taken full control of their
            financial life. Secure your account and begin optimizing your
            spending.
          </p>
        </div>

        <div className="text-sm opacity-60 font-medium">
          © {new Date().getFullYear()} TeenSpend Pro. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-10 lg:hidden">
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              TeenSpend Pro
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-text-main mb-2">
            Create an account
          </h2>

          <p className="text-text-secondary mb-8">
            Enter your details below.
          </p>

          {error && (
            <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm mb-6 font-semibold flex items-center gap-2 border border-danger/20">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  First name
                </label>

                <input
                  type="text"
                  name="firstName"
                  required
                  className="input-field"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Last name
                </label>

                <input
                  type="text"
                  name="lastName"
                  required
                  className="input-field"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">
                Email address
              </label>

              <input
                type="email"
                name="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                required
                className="input-field"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 mt-4 text-base"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;