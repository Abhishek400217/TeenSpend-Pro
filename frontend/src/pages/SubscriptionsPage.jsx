import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Chart from 'react-apexcharts';
import { TrashIcon } from '@heroicons/react/24/outline';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleDelete = async () => {
    if (!subscriptionToDelete) return;
    try {
      await api.delete(`/subscriptions/${subscriptionToDelete.id}`);
      setSubscriptions(subscriptions.filter(s => s.id !== subscriptionToDelete.id));
      setToastMessage('✓ Subscription deleted');
      window.dispatchEvent(new Event('dataChanged'));
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setToastMessage('Could not delete subscription');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setSubscriptionToDelete(null);
    }
  };

  const fetchSubs = async () => {
    try {
      const res = await api.get('/subscriptions');
      setSubscriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
    window.addEventListener('dataChanged', fetchSubs);
    return () => window.removeEventListener('dataChanged', fetchSubs);
  }, []);

  const totalMonthly = subscriptions.reduce((sum, s) => {
    if (s.billingCycle === 'Yearly') return sum + (s.cost / 12);
    return sum + s.cost;
  }, 0);

  const totalYearly = totalMonthly * 12;

  // Chart config
  const chartOptions = {
    chart: { type: 'donut', background: 'transparent' },
    labels: subscriptions.map(s => s.name),
    colors: ['#5B5BD6', '#22C55E', '#F59E0B', '#EF4444', '#7C6CFF', '#CBD5E1'],
    dataLabels: { enabled: false },
    stroke: { show: false },
    plotOptions: {
      pie: { donut: { size: '75%', labels: { show: true, name: { show: true }, value: { show: true, formatter: (val) => `₹${val}` } } } }
    },
    legend: { position: 'bottom', fontFamily: 'Inter', labels: { colors: '#475569' } }
  };
  const chartSeries = subscriptions.map(s => {
    return s.billingCycle === 'Yearly' ? s.cost / 12 : s.cost;
  });

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-main">Subscriptions</h2>
        <p className="text-text-secondary mt-1 font-medium">Manage your recurring costs.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-6 flex flex-col justify-between">
            <p className="text-sm font-semibold text-text-secondary mb-2">Total Monthly Cost</p>
            <h3 className="text-4xl font-mono font-bold text-text-main">₹{totalMonthly.toFixed(2)}</h3>
            <p className="text-xs font-semibold text-text-secondary mt-4">Based on {subscriptions.length} active subscriptions</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6 flex flex-col justify-between border-l-4 border-l-danger">
            <p className="text-sm font-semibold text-text-secondary mb-2">Total Yearly Impact</p>
            <h3 className="text-4xl font-mono font-bold text-danger">₹{totalYearly.toFixed(2)}</h3>
            <p className="text-xs font-semibold text-text-secondary mt-4">Projected based on current costs</p>
          </motion.div>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-6">
          <h3 className="text-lg font-bold text-text-main mb-4">Cost Breakdown (Monthly)</h3>
          <div className="h-48">
            {chartSeries.length > 0 ? (
              <Chart options={chartOptions} series={chartSeries} type="donut" height="100%" />
            ) : (
              <div className="flex h-full items-center justify-center text-text-secondary font-medium text-sm">No active subscriptions</div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border-main">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-text-secondary">Service</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-text-secondary">Cost</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-text-secondary">Billing Cycle</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-text-secondary">Next Billing</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-text-secondary">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-text-secondary"></th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => (
                <tr key={sub.id} className="border-b border-border-main/50 last:border-0 hover:bg-hover transition-colors">
                  <td className="p-4 font-semibold text-text-main flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-background border border-border-main flex items-center justify-center text-primary font-bold">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    {sub.name}
                  </td>
                  <td className="p-4 font-mono font-bold text-text-main">₹{sub.cost.toFixed(2)}</td>
                  <td className="p-4 text-sm text-text-secondary">
                    <span className="bg-background border border-border-main px-2 py-1 rounded text-xs font-semibold">
                      {sub.billingCycle}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-semibold text-text-main">{sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold px-2 py-1 bg-success/10 text-success rounded-full">Active</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSubscriptionToDelete(sub)} className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-secondary font-semibold text-sm">
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-2xl mb-1">💸</span>
                       No subscriptions added.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-surface border border-border-main text-text-main px-6 py-3 rounded-xl shadow-lg z-50 font-semibold flex items-center gap-2">
          <span>{toastMessage.includes('Could not') ? '⚠️' : '✅'}</span> {toastMessage}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {subscriptionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="surface-card w-full max-w-sm p-6 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
                <TrashIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Delete subscription?</h3>
              <p className="text-text-secondary font-medium mb-6">
                Are you sure you want to delete "{subscriptionToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSubscriptionToDelete(null)}
                  className="flex-1 btn-secondary py-2.5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-danger hover:bg-danger/90 text-white font-bold rounded-xl transition-colors py-2.5 shadow-sm shadow-danger/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionsPage;
