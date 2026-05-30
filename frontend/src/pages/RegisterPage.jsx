import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  const { sendOtp, verifyOtp, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return setError('Please fill all fields');
    }
    setLoading(true);
    try {
      await sendOtp(formData.email, 'REGISTER');
      setStep(2);
      setCooldown(60);
      setError('');
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK' || !err.response) setError('Backend unavailable. Please try again later.');
      else setError(err.response?.data?.message || err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return setError('Please enter OTP');
    setLoading(true);
    try {
      await verifyOtp(formData.email, formData.otp, 'REGISTER');
      setStep(3);
      setError('');
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK' || !err.response) setError('Backend unavailable. Please try again later.');
      else if (err.response?.status === 400 && err.response?.data?.message?.toLowerCase().includes('expire')) setError('OTP expired. Please request a new one.');
      else setError(err.response?.data?.message || err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setLoading(true);
    try {
      await register({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });
      setStep(4);
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK' || !err.response) setError('Backend unavailable. Please try again later.');
      else setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
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
          <h2 className="text-4xl font-bold mb-4 leading-tight">Start your journey.</h2>
          <p className="text-lg text-primary-100 opacity-90 leading-relaxed">
            Join thousands of users who have taken full control of their financial life. Secure your account and begin optimizing your spending.
          </p>
        </div>
        <div className="text-sm opacity-60 font-medium">
          © {new Date().getFullYear()} TeenSpend Pro. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-10 lg:hidden">
            <h1 className="text-2xl font-bold text-primary tracking-tight">TeenSpend Pro</h1>
          </div>

          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold text-text-main mb-2">Create an account</h2>
              <p className="text-text-secondary mb-8">Step 1: Enter your details below.</p>
              
              {error && (
                <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm mb-6 font-semibold flex items-center gap-2 border border-danger/20">
                  <span className="text-lg">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">First name</label>
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
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Last name</label>
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
                  <label className="block text-sm font-semibold text-text-main mb-1.5">Email address</label>
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

                <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 mt-4 text-base">
                  {loading ? 'Sending OTP...' : 'Send OTP Email'}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-3xl font-bold text-text-main mb-2">Verify Email</h2>
              <p className="text-text-secondary mb-8">Step 2: We sent a 6-digit code to <span className="font-bold text-text-main">{formData.email}</span>.</p>
              
              {error && (
                <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm mb-6 font-semibold flex items-center gap-2 border border-danger/20">
                  <span className="text-lg">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">OTP Code</label>
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength="6"
                    className="input-field font-mono text-center text-lg tracking-widest"
                    placeholder="------"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 mt-4 text-base">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => handleSendOtp()} 
                  disabled={loading || cooldown > 0} 
                  className="text-sm font-bold text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-3xl font-bold text-text-main mb-2">Secure Account</h2>
              <p className="text-text-secondary mb-8">Step 3: Create a strong password.</p>
              
              {error && (
                <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm mb-6 font-semibold flex items-center gap-2 border border-danger/20">
                  <span className="text-lg">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">Password</label>
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
                  <label className="block text-sm font-semibold text-text-main mb-1.5">Confirm Password</label>
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

                <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 mt-4 text-base">
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-20 h-20 text-success mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-text-main mb-4">Registration Complete!</h2>
              <p className="text-text-secondary mb-8">Your account has been successfully created and verified.</p>
              <button onClick={() => navigate('/dashboard')} className="w-full btn-primary py-3.5 text-base">
                Go to Dashboard
              </button>
            </div>
          )}

          {step === 1 && (
            <p className="mt-8 text-center text-sm text-text-secondary font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
