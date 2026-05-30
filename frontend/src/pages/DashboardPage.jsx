import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { SparklesIcon, ArrowTrendingUpIcon, DocumentArrowDownIcon, TableCellsIcon, TrashIcon } from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await api.delete(`/expenses/${expenseToDelete.id}`);
      setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
      setToastMessage('✓ Transaction deleted');
      window.dispatchEvent(new Event('dataChanged'));
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setToastMessage('Could not delete transaction');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setExpenseToDelete(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, insRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/insights')
        ]);
        setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
        setInsights(Array.isArray(insRes.data) ? insRes.data : []);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    window.addEventListener('dataChanged', fetchData);
    return () => window.removeEventListener('dataChanged', fetchData);
  }, []);

  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const budget = user?.monthlyBudget || 0;
  const remaining = budget - totalSpent;
  const score = user?.financialScore || 100;

  const handleExportPDF = () => {
    alert('PDF Export initiated (Backend integration pending)');
  };

  const handleExportCSV = () => {
    alert('CSV Export initiated (Backend integration pending)');
  };

  // Chart configuration for Spending Trend
  const trendOptions = {
    chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
    colors: ['#5B5BD6'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { 
      categories: expenses.length > 0 ? expenses.slice(0, 7).reverse().map(e => new Date(e.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })) : ['No Data'],
      labels: { style: { colors: '#64748B', fontFamily: 'Inter', fontWeight: 500 } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { 
      labels: { formatter: (val) => `₹${val}`, style: { colors: '#64748B', fontFamily: 'Inter', fontWeight: 500 } } 
    },
    grid: { borderColor: '#E5E7EB', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    theme: { mode: 'light' }
  };
  const trendSeries = expenses.length > 0 ? [{ name: 'Spent', data: expenses.slice(0, 7).reverse().map(e => e.amount) }] : [];

  // Chart configuration for Categories
  const categoryData = expenses.reduce((acc, curr) => {
    if(curr.category) {
      acc[curr.category] = (acc[curr.category] || 0) + (curr.amount || 0);
    }
    return acc;
  }, {});
  
  const donutOptions = {
    chart: { type: 'donut', background: 'transparent' },
    labels: Object.keys(categoryData).length > 0 ? Object.keys(categoryData) : ['Empty'],
    colors: ['#5B5BD6', '#16A34A', '#F59E0B', '#DC2626', '#7C6CFF', '#CBD5E1'],
    dataLabels: { enabled: false },
    stroke: { show: false },
    plotOptions: {
      pie: { donut: { size: '75%', labels: { show: true, name: { show: true }, value: { show: true, formatter: (val) => `₹${val}` } } } }
    },
    legend: { position: 'bottom', fontFamily: 'Inter', labels: { colors: '#475569' } }
  };
  const donutSeries = Object.keys(categoryData).length > 0 ? Object.values(categoryData) : [1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           <p className="text-text-secondary text-sm font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8"
    >
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-main">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}</h2>
          <p className="text-text-secondary font-medium mt-1">Here is your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
            <TableCellsIcon className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
            <DocumentArrowDownIcon className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="surface-card p-6">
          <p className="text-sm font-semibold text-text-secondary mb-2">Monthly Budget</p>
          <h3 className="text-3xl font-mono font-bold text-text-main">₹{budget.toFixed(2)}</h3>
        </motion.div>
        
        <motion.div variants={itemVariants} className="surface-card p-6">
          <p className="text-sm font-semibold text-text-secondary mb-2">Total Spent</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-mono font-bold text-danger">₹{totalSpent.toFixed(2)}</h3>
            {totalSpent > budget && budget > 0 && <ArrowTrendingUpIcon className="w-6 h-6 text-danger mb-1" />}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="surface-card p-6">
          <p className="text-sm font-semibold text-text-secondary mb-2">Remaining</p>
          <h3 className={`text-3xl font-mono font-bold ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
            ₹{remaining.toFixed(2)}
          </h3>
        </motion.div>

        <motion.div variants={itemVariants} className="surface-card p-6 flex flex-col justify-between border-l-4 border-l-primary">
          <p className="text-sm font-semibold text-text-secondary">Financial Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-mono font-bold text-primary">{score}</h3>
            <span className="text-text-secondary font-semibold">/ 100</span>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend */}
        <motion.div variants={itemVariants} className="surface-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-text-main mb-4">Spending Trend</h3>
          <div className="h-72 w-full">
            {expenses.length > 0 ? (
              <Chart options={trendOptions} series={trendSeries} type="area" height="100%" />
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-text-secondary gap-2">
                 <span className="text-2xl">📈</span>
                 <p className="font-semibold text-sm">No spending data yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Categories / Insights */}
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants} className="surface-card p-6 flex-1">
            <h3 className="text-lg font-bold text-text-main mb-4">Categories</h3>
            <div className="h-48">
              {Object.keys(categoryData).length > 0 ? (
                <Chart options={donutOptions} series={donutSeries} type="donut" height="100%" />
              ) : (
                <div className="flex h-full items-center justify-center text-text-secondary text-sm font-semibold">No category data</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Row 3: Transactions and Smart Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-main">Recent Transactions</h3>
            <button className="text-sm text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-1">
            {expenses.slice(0, 5).map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-3 hover:bg-hover rounded-xl transition-colors border border-transparent group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-background border border-border-main flex items-center justify-center text-lg shadow-sm">
                    {exp.category === 'Food' ? '🍔' : exp.category === 'Transport' ? '🚗' : exp.category === 'Entertainment' ? '🎮' : '🛍️'}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main">{exp.title}</h4>
                    <p className="text-xs font-semibold text-text-secondary">{new Date(exp.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} • {exp.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="font-mono font-bold text-text-main">-₹{exp.amount.toFixed(2)}</span>
                  <button onClick={() => setExpenseToDelete(exp)} className="opacity-0 group-hover:opacity-100 p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-8 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-background border border-border-main flex items-center justify-center text-xl shadow-sm">💳</div>
                <p className="text-text-secondary font-semibold text-sm">No transactions found.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Insights Card */}
        <motion.div variants={itemVariants} className="surface-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <div className="flex items-center gap-2 mb-6">
            <SparklesIcon className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-text-main">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-surface border border-border-main rounded-xl text-sm leading-relaxed text-text-main shadow-sm font-medium">
                  {insight}
                </div>
              ))
            ) : (
              <div className="p-4 bg-surface border border-border-main rounded-xl text-sm leading-relaxed text-text-main shadow-sm font-medium">
                Based on your spending, cutting Food costs by 15% could save you ₹300 this week.
              </div>
            )}
          </div>
          <button className="w-full mt-6 btn-secondary py-2.5 text-sm">Ask AI Coach</button>
        </motion.div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-surface border border-border-main text-text-main px-6 py-3 rounded-xl shadow-lg z-50 font-semibold flex items-center gap-2">
          <span>{toastMessage.includes('Could not') ? '⚠️' : '✅'}</span> {toastMessage}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card w-full max-w-sm p-6 shadow-2xl relative"
          >
            <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <TrashIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Delete transaction?</h3>
            <p className="text-text-secondary font-medium mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setExpenseToDelete(null)}
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
    </motion.div>
  );
};

export default DashboardPage;
