import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setAnalytics(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  const pieData = analytics?.categoryBreakdown 
    ? Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Analytics & Insights</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[400px]">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Category Distribution</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Smart Insights</h2>
            <div className="space-y-4">
              {analytics?.totalExpensesThisMonth > analytics?.monthlyBudget ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                  <p className="font-semibold">⚠️ Budget Exceeded</p>
                  <p className="text-sm mt-1">You have exceeded your monthly budget by ${(analytics.totalExpensesThisMonth - analytics.monthlyBudget).toFixed(2)}. Consider cutting back on non-essential expenses.</p>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                  <p className="font-semibold">✅ On Track</p>
                  <p className="text-sm mt-1">Great job! You are within your monthly budget. You have ${analytics?.remainingBudget?.toFixed(2)} left to spend.</p>
                </div>
              )}
              
              {pieData.length > 0 && (
                <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                  <p className="font-semibold">📊 Top Spending Category</p>
                  <p className="text-sm mt-1">
                    Your highest spending category is <strong>{pieData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
