import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Chart from 'react-apexcharts';
import { PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', deadline: '', icon: '🎯' });
  const [fundingGoal, setFundingGoal] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    window.addEventListener('dataChanged', fetchGoals);
    return () => window.removeEventListener('dataChanged', fetchGoals);
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', { ...newGoal, targetAmount: parseFloat(newGoal.targetAmount) });
      setShowModal(false);
      fetchGoals();
      window.dispatchEvent(new Event('dataChanged'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFundsSubmit = async (e) => {
    e.preventDefault();
    if (!fundAmount || isNaN(fundAmount)) return;
    try {
      console.log('goalId:', fundingGoal.id);
      console.log('amount:', fundAmount);
      const res = await api.patch(`/goals/${fundingGoal.id}/add-funds`, { amount: parseFloat(fundAmount) });
      console.log('response:', res.data);
      const updatedGoal = res.data;
      setGoals(goals.map(g => g.id === fundingGoal.id ? updatedGoal : g));
      window.dispatchEvent(new Event('dataChanged'));
      
      if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
        showToast('🎉 Goal completed');
      } else {
        showToast('✓ Funds added successfully');
      }
      setFundingGoal(null);
      setFundAmount('');
    } catch (err) {
      console.log('error:', err);
      showToast('⚠️ Could not add funds');
    }
  };

  const handleDeleteGoal = async () => {
    try {
      await api.delete(`/goals/${deletingGoal.id}`);
      setGoals(goals.filter(g => g.id !== deletingGoal.id));
      setDeletingGoal(null);
      showToast('🗑 Goal deleted');
      window.dispatchEvent(new Event('dataChanged'));
    } catch (err) {
      console.error(err);
      showToast('⚠️ Could not delete goal');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-main">Goals</h2>
          <p className="text-text-secondary mt-1 font-medium">Track your savings for the things that matter.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, idx) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const isCompleted = goal.status === 'COMPLETED' || progress >= 100;
          const chartOptions = {
            chart: { type: 'radialBar', sparkline: { enabled: true } },
            plotOptions: {
              radialBar: {
                hollow: { size: '65%' },
                track: { background: '#E5E7EB', margin: 0 },
                dataLabels: {
                  name: { show: false },
                  value: { show: true, fontSize: '20px', fontWeight: 'bold', color: '#111827', formatter: (val) => `${val.toFixed(0)}%` }
                }
              }
            },
            colors: [isCompleted ? '#16A34A' : '#5B5BD6'],
            stroke: { lineCap: 'round' }
          };

          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={`surface-card p-6 flex flex-col justify-between group transition-colors ${isCompleted ? 'border-success' : 'hover:border-primary/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="w-12 h-12 rounded-xl bg-background border border-border-main flex items-center justify-center text-2xl shadow-sm">
                  {goal.icon}
                </div>
                <div className="flex items-center gap-2">
                  {goal.deadline && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-surface border border-border-main rounded-lg text-text-secondary">
                      {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  <button onClick={() => setDeletingGoal(goal)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 mb-6">
                <h3 className="text-xl font-bold text-text-main mb-1">{goal.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-mono font-bold text-text-main">₹{goal.currentAmount.toFixed(0)}</span>
                  <span className="text-sm font-mono font-bold text-text-secondary">/ ₹{goal.targetAmount.toFixed(0)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                 <div className="w-24 h-24 -ml-4">
                   <Chart options={chartOptions} series={[progress]} type="radialBar" height={120} />
                 </div>
                 {isCompleted ? (
                   <span className="text-success font-bold flex items-center gap-1 text-sm bg-success/10 px-3 py-1.5 rounded-full">
                     ✅ Completed
                   </span>
                 ) : (
                   <button onClick={() => setFundingGoal(goal)} className="btn-secondary py-2 px-4 text-sm font-bold">
                     Add Funds
                   </button>
                 )}
              </div>
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-surface border border-border-main rounded-full flex items-center justify-center text-3xl shadow-sm mb-4">🎯</div>
             <h3 className="text-xl font-bold text-text-main mb-2">No goals yet.</h3>
             <p className="text-text-secondary max-w-sm mb-6 font-medium">Create your first savings goal.</p>
             <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
               <PlusIcon className="w-5 h-5" /> Create Goal
             </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-text-main/20 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="surface-card w-full max-w-md relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-main">Create New Goal</h2>
                <button onClick={() => setShowModal(false)} className="text-text-secondary hover:bg-hover p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-text-main">Goal Name</label>
                  <input required type="text" className="input-field" placeholder="e.g. MacBook Pro" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-text-main">Target Amount (₹)</label>
                  <input required type="number" className="input-field font-mono" placeholder="100000" value={newGoal.targetAmount} onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-text-main">Deadline (Optional)</label>
                  <input type="date" className="input-field text-text-secondary" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-text-main">Emoji Icon</label>
                  <input type="text" className="input-field text-2xl h-14" maxLength="2" value={newGoal.icon} onChange={e => setNewGoal({...newGoal, icon: e.target.value})} />
                </div>
                <div className="pt-4">
                  <button type="submit" className="btn-primary w-full py-3.5 text-base">Save Goal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fundingGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-text-main/20 backdrop-blur-sm" onClick={() => setFundingGoal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="surface-card w-full max-w-sm relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-main">Add Funds</h2>
                <button onClick={() => setFundingGoal(null)} className="text-text-secondary hover:bg-hover p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
              </div>
              <div className="mb-6 bg-background border border-border-main p-4 rounded-xl">
                 <p className="text-sm font-semibold text-text-secondary mb-1">Goal: {fundingGoal.name}</p>
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-xl font-bold text-text-main">₹{fundingGoal.currentAmount.toFixed(0)}</span>
                   <span className="text-sm font-semibold text-text-secondary">/ ₹{fundingGoal.targetAmount.toFixed(0)} Target</span>
                 </div>
              </div>
              <form onSubmit={handleAddFundsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-text-main">Enter Amount (₹)</label>
                  <input required type="number" min="1" max={fundingGoal.targetAmount - fundingGoal.currentAmount} className="input-field font-mono text-lg" placeholder="500" value={fundAmount} onChange={e => setFundAmount(e.target.value)} />
                </div>
                {fundAmount && !isNaN(fundAmount) && (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-primary uppercase tracking-wide">Preview</p>
                    <div className="flex justify-between text-sm font-semibold">
                       <span className="text-text-secondary">After adding:</span>
                       <span className="text-text-main">₹{(fundingGoal.currentAmount + parseFloat(fundAmount)).toFixed(0)} / ₹{fundingGoal.targetAmount.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                       <span className="text-text-secondary">Remaining:</span>
                       <span className="text-text-main">₹{Math.max(0, fundingGoal.targetAmount - (fundingGoal.currentAmount + parseFloat(fundAmount))).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                       <span className="text-text-secondary">Progress:</span>
                       <span className="text-text-main">{Math.min(100, ((fundingGoal.currentAmount + parseFloat(fundAmount)) / fundingGoal.targetAmount) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setFundingGoal(null)} className="flex-1 btn-secondary py-3 text-sm">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-3 text-sm">Add Funds</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deletingGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-text-main/20 backdrop-blur-sm" onClick={() => setDeletingGoal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="surface-card w-full max-w-sm relative z-10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                  Delete Goal?
                </h2>
                <button onClick={() => setDeletingGoal(null)} className="text-text-secondary hover:bg-hover p-1.5 rounded-lg"><XMarkIcon className="w-5 h-5"/></button>
              </div>
              <p className="text-text-main font-bold mb-2">You are closer than you think.</p>
              <p className="text-text-secondary text-sm font-medium mb-6">Deleting this goal may delay your progress.</p>
              
              <div className="flex gap-3 pt-2">
                 <button onClick={() => setDeletingGoal(null)} className="flex-1 btn-secondary py-3">Keep Goal</button>
                 <button onClick={handleDeleteGoal} className="flex-1 bg-danger hover:bg-danger/90 text-white font-bold rounded-xl transition-colors py-3 shadow-sm shadow-danger/20">Delete Anyway</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-surface border border-border-main text-text-main px-6 py-3 rounded-xl shadow-lg z-50 font-semibold flex items-center gap-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
