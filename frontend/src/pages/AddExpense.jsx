import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    priority: 'Medium',
    notes: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to add expense');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Add Expense</h1>
        
        <div className="max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input name="title" type="text" required className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Lunch at McDonald's" onChange={handleChange} value={formData.title} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input name="amount" type="number" step="0.01" min="0" required className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" onChange={handleChange} value={formData.amount} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input name="date" type="date" required className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} value={formData.date} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white" onChange={handleChange} value={formData.category}>
                  {['Food', 'Travel', 'Education', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Miscellaneous'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select name="priority" className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white" onChange={handleChange} value={formData.priority}>
                  {['High', 'Medium', 'Low'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea name="notes" rows="3" className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Any details..." onChange={handleChange} value={formData.notes}></textarea>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5">
                <PlusCircle className="w-5 h-5" />
                Save Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddExpense;
