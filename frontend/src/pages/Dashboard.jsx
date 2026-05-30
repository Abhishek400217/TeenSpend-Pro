import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { Wallet, Target, TrendingDown, Clock } from 'lucide-react';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, expensesRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/expenses')
        ]);
        setAnalytics(analyticsRes.data);
        setRecentExpenses(expensesRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Expenses (Month)</p>
            <h3 className="text-2xl font-bold text-slate-900">${analytics?.totalExpensesThisMonth?.toFixed(2) || '0.00'}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium mb-1">Remaining Budget</p>
            <h3 className="text-2xl font-bold text-slate-900">${analytics?.remainingBudget?.toFixed(2) || '0.00'}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium mb-1">Savings</p>
            <h3 className="text-2xl font-bold text-slate-900">${analytics?.savings?.toFixed(2) || '0.00'}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-2">Monthly Progress</p>
              <div className="flex items-end gap-2 mb-2">
                <h3 className="text-2xl font-bold text-slate-900">{analytics?.monthlyProgress?.toFixed(1) || 0}%</h3>
                <span className="text-sm text-slate-500 mb-1">used</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${analytics?.monthlyProgress > 90 ? 'bg-red-500' : 'bg-blue-600'}`} 
                style={{ width: `${analytics?.monthlyProgress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Expenses</h2>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          
          {recentExpenses.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No recent expenses. Time to add some!</p>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                      {expense.category === 'Food' ? '🍔' : expense.category === 'Travel' ? '🚗' : expense.category === 'Entertainment' ? '🎬' : '🛒'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{expense.title}</h4>
                      <p className="text-sm text-slate-500">{expense.category} • {expense.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">-${expense.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
