import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyBudget: user?.monthlyBudget || 100,
    income: 0,
    studentStatus: 'High School',
    savingGoal: 0,
    primaryCategory: 'Food'
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/user/onboard', formData);
      updateUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 transition-colors">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome to TeenSpend Pro</h1>
        <p className="text-text-secondary font-medium">Let's set up your premium dashboard.</p>
      </div>

      <div className="w-full max-w-lg surface-card p-8 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <h2 className="text-2xl font-semibold">The Basics</h2>
              <div>
                <label className="block text-sm font-medium mb-2">What is your current student status?</label>
                <select className="input-field" value={formData.studentStatus} onChange={e => setFormData({...formData, studentStatus: e.target.value})}>
                  <option>Middle School</option>
                  <option>High School</option>
                  <option>College / University</option>
                  <option>Graduated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Where do you spend the most?</label>
                <select className="input-field" value={formData.primaryCategory} onChange={e => setFormData({...formData, primaryCategory: e.target.value})}>
                  <option>Food & Dining</option>
                  <option>Entertainment</option>
                  <option>Shopping</option>
                  <option>Transport</option>
                  <option>Subscriptions</option>
                </select>
              </div>
              <button onClick={handleNext} className="w-full btn-primary">Continue</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <h2 className="text-2xl font-semibold">Financial Snapshot</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Allowance / Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">$</span>
                  <input type="number" className="input-field pl-8 font-mono" value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Monthly Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">$</span>
                  <input type="number" className="input-field pl-8 font-mono" value={formData.monthlyBudget} onChange={e => setFormData({...formData, monthlyBudget: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleBack} className="w-1/3 btn-secondary">Back</button>
                <button onClick={handleNext} className="w-2/3 btn-primary">Continue</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <h2 className="text-2xl font-semibold">Your Goals</h2>
              <div className="text-center p-6 bg-background border border-border-main rounded-xl mb-4">
                <p className="text-4xl mb-2">🎯</p>
                <p className="text-sm text-text-secondary font-medium">Set a target to save towards. You can add more later.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initial Saving Goal Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">$</span>
                  <input type="number" className="input-field pl-8 font-mono" value={formData.savingGoal} onChange={e => setFormData({...formData, savingGoal: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleBack} className="w-1/3 btn-secondary">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="w-2/3 btn-primary relative overflow-hidden">
                  {loading ? 'Building Dashboard...' : 'Finish Setup'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
