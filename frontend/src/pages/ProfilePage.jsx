import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, DocumentArrowDownIcon, ArrowPathIcon, KeyIcon, TrashIcon, ArrowRightOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Security state
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, goalsRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/goals')
        ]);
        setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
        setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
      } catch (err) {
        console.error("Error fetching data for profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalExpenseThisMonth = currentMonthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalSavings = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  
  const categoryTotals = {};
  currentMonthExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + (e.amount || 0);
  });
  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const highestSpendingCategory = highestCategory ? highestCategory[0] : 'None';

  const completedGoals = goals.filter(g => g.status === 'COMPLETED' || g.currentAmount >= g.targetAmount).length;
  const monthlyGoalCompletion = goals.length > 0 ? `${completedGoals} / ${goals.length}` : '0 / 0';

  const handleExportPDF = async () => {
    try {
      showToast('Generating PDF...');
      const response = await api.get('/export/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TeenSpend_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast('✅ Download started');
    } catch (err) {
      console.error(err);
      showToast('⚠️ Export failed');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('⚠️ Passwords do not match');
      return;
    }
    try {
      await api.put('/user/password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      showToast('✅ Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.error ? `⚠️ ${err.response.data.error}` : '⚠️ Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      showToast('⚠️ Reason is required');
      return;
    }
    try {
      await api.delete('/user/account', { data: { reason: deleteReason } });
      setShowDeleteModal(false);
      logout();
    } catch (err) {
      showToast('⚠️ Failed to delete account');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="surface-card p-8 flex flex-col md:flex-row items-center gap-6 md:justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-4xl text-white font-bold">{user?.fullName?.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-1">{user?.fullName}</h2>
            <p className="text-text-secondary font-medium mb-3">{user?.email}</p>
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Level {user?.level || 1} Saver</span>
          </div>
        </div>
        <div className="text-center md:text-right space-y-2 border-t md:border-t-0 md:border-l border-border-main pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
           <p className="text-sm font-semibold text-text-secondary">Member Since</p>
           <p className="text-text-main font-bold">May 2026</p>
           <div className="mt-2 flex items-center justify-center md:justify-end gap-2 text-sm font-bold text-success">
             <div className="w-2 h-2 rounded-full bg-success"></div> Account Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Financial Overview & Quick Actions */}
        <div className="md:col-span-2 space-y-6">
          <div className="surface-card p-6">
            <h3 className="text-lg font-bold text-text-main mb-6">Financial Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background border border-border-main rounded-xl">
                <p className="text-text-secondary font-semibold text-sm mb-1">Total Expense This Month</p>
                <p className="text-2xl font-mono font-bold text-danger">₹{totalExpenseThisMonth.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-background border border-border-main rounded-xl">
                <p className="text-text-secondary font-semibold text-sm mb-1">Total Savings (Goals)</p>
                <p className="text-2xl font-mono font-bold text-success">₹{totalSavings.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-background border border-border-main rounded-xl">
                <p className="text-text-secondary font-semibold text-sm mb-1">Highest Spending</p>
                <p className="text-lg font-bold text-text-main">{highestSpendingCategory}</p>
              </div>
              <div className="p-4 bg-background border border-border-main rounded-xl">
                <p className="text-text-secondary font-semibold text-sm mb-1">Goal Completion</p>
                <p className="text-xl font-bold text-text-main">{monthlyGoalCompletion}</p>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
               Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleExportPDF} className="flex flex-col items-center justify-center gap-3 p-4 bg-background border border-border-main hover:border-primary/50 rounded-xl transition-colors group">
                <DocumentArrowDownIcon className="w-8 h-8 text-text-secondary group-hover:text-primary transition-colors" />
                <span className="font-semibold text-sm text-text-main">Export Data (PDF)</span>
              </button>
              <button onClick={() => window.location.reload()} className="flex flex-col items-center justify-center gap-3 p-4 bg-background border border-border-main hover:border-primary/50 rounded-xl transition-colors group">
                <ArrowPathIcon className="w-8 h-8 text-text-secondary group-hover:text-primary transition-colors" />
                <span className="font-semibold text-sm text-text-main">Refresh Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security */}
        <div className="space-y-6">
          <div className="surface-card p-6 border-t-4 border-t-text-main">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <KeyIcon className="w-5 h-5 text-text-secondary" /> Security
            </h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4 mb-6 pb-6 border-b border-border-main">
              <div>
                <label className="block text-xs font-bold text-text-main mb-1.5">Current Password</label>
                <input required type="password" placeholder="••••••••" className="input-field text-sm py-2" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-main mb-1.5">New Password</label>
                <input required type="password" placeholder="••••••••" className="input-field text-sm py-2" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-main mb-1.5">Confirm Password</label>
                <input required type="password" placeholder="••••••••" className="input-field text-sm py-2" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-sm">Change Password</button>
            </form>

            <button onClick={logout} className="w-full btn-secondary flex items-center justify-center gap-2 mb-4 py-2.5 text-sm font-bold">
              <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign Out
            </button>
            
            <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center justify-center gap-2 bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors py-2.5 rounded-lg text-sm font-bold">
              <TrashIcon className="w-4 h-4" /> Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-text-main/20 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="surface-card w-full max-w-md relative z-10 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-danger flex items-center gap-2">
                    <TrashIcon className="w-6 h-6" /> Delete Account
                  </h2>
                  <button onClick={() => setShowDeleteModal(false)} className="text-text-secondary hover:bg-hover p-1.5 rounded-lg"><XMarkIcon className="w-5 h-5"/></button>
                </div>
                <p className="text-text-main font-bold mb-2">This action cannot be undone.</p>
                <p className="text-text-secondary text-sm font-medium mb-6">All your expenses, goals, and subscriptions will be permanently erased.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-1.5">Why are you deleting your account? *</label>
                    <textarea required rows="3" className="input-field" placeholder="Please share your feedback..." value={deleteReason} onChange={e => setDeleteReason(e.target.value)}></textarea>
                  </div>
                  <div className="flex gap-3 pt-2">
                     <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-secondary py-3">Cancel</button>
                     <button onClick={handleDeleteAccount} className="flex-1 bg-danger hover:bg-danger/90 text-white font-bold rounded-xl transition-colors py-3 shadow-sm shadow-danger/20">Delete Account</button>
                  </div>
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

export default ProfilePage;
