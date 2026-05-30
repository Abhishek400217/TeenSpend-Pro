import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const AnalyticsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      api.get('/expenses')
        .then(res => {
          setExpenses(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => {
          console.error("Analytics fetch error:", err);
          setError("Failed to load analytics data.");
        })
        .finally(() => {
          setLoading(false);
        });
    };
    
    fetchData();
    window.addEventListener('dataChanged', fetchData);
    return () => window.removeEventListener('dataChanged', fetchData);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary text-sm font-medium">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center text-2xl">⚠️</div>
        <h3 className="text-xl font-bold text-text-main">Oops! Something went wrong</h3>
        <p className="text-text-secondary max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 btn-primary py-2 px-6">Try Again</button>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 bg-surface border border-border-main rounded-full flex items-center justify-center text-2xl shadow-sm">📊</div>
        <h3 className="text-xl font-bold text-text-main">No analytics yet.</h3>
        <p className="text-text-secondary max-w-md">Add transactions to unlock insights.</p>
      </div>
    );
  }

  // Prepare data for advanced charts safely
  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Subscription', 'Other'];
  
  // 1. Category Radar / Polar Area
  const categoryTotals = categories.map(cat => ({
    name: cat,
    value: expenses.filter(e => e?.category === cat).reduce((sum, e) => sum + (e?.amount || 0), 0)
  })).filter(c => c.value > 0);

  const polarOptions = {
    chart: { type: 'polarArea', background: 'transparent', toolbar: { show: false } },
    labels: categoryTotals.length > 0 ? categoryTotals.map(c => c.name) : ['No Data'],
    stroke: { colors: ['#FFFFFF', '#E5E7EB'] },
    fill: { opacity: 0.8 },
    theme: { mode: 'light' },
    legend: { position: 'bottom', fontFamily: 'Inter', labels: { colors: '#475569' } },
    yaxis: { show: false }
  };
  const polarSeries = categoryTotals.length > 0 ? categoryTotals.map(c => c.value) : [0];



  // 3. Month Comparison (Bar)
  const barOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { 
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      labels: { style: { colors: '#64748B', fontFamily: 'Inter' } },
      axisBorder: { show: false }, axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: '#64748B', fontFamily: 'Inter' }, formatter: (val) => `₹${val}` } },
    fill: { opacity: 1 },
    colors: ['#5B5BD6', '#E2E8F0'],
    legend: { fontFamily: 'Inter', labels: { colors: '#475569' } },
    grid: { borderColor: '#E5E7EB', strokeDashArray: 4 }
  };
  const barSeries = [
    { name: 'This Month', data: [400, 300, 550, 420] },
    { name: 'Last Month', data: [350, 410, 320, 500] }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-main">Analytics</h2>
        <p className="text-text-secondary mt-1 font-medium">Deep dive into your spending habits.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Polar Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-6">
          <h3 className="text-lg font-bold text-text-main mb-6">Category Distribution</h3>
          <div className="h-80">
            {polarSeries.length > 0 && categoryTotals.length > 0 ? (
               <Chart options={polarOptions} series={polarSeries} type="polarArea" height="100%" />
            ) : (
               <div className="flex h-full items-center justify-center text-text-secondary font-semibold">No data available</div>
            )}
          </div>
        </motion.div>

        {/* Month Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6">
          <h3 className="text-lg font-bold text-text-main mb-6">Month vs Month</h3>
          <div className="h-80">
            <Chart options={barOptions} series={barSeries} type="bar" height="100%" />
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Category Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-6">
          <h3 className="text-lg font-bold text-text-main mb-6">Leaderboard</h3>
          <div className="space-y-5">
            {categoryTotals.length > 0 ? categoryTotals.sort((a, b) => b.value - a.value).map((cat, idx) => {
              const max = Math.max(...categoryTotals.map(c => c.value), 1);
              const percentage = (cat.value / max) * 100;
              return (
                <div key={cat.name} className="flex items-center gap-4">
                  <span className="text-text-secondary font-mono font-bold w-4">{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm text-text-main">{cat.name}</span>
                      <span className="font-mono text-sm font-bold text-text-main">₹{cat.value.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border-main/50">
                      <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-text-secondary text-sm font-semibold">No category data yet.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
