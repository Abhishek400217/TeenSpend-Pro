import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TagIcon, CalendarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other',
    priority: 'Medium',
    notes: '',
    tags: '',
    isSubscription: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Subscription', 'Other'];
  
  // Smart categorization
  useEffect(() => {
    const text = (formData.title + ' ' + formData.notes).toLowerCase();
    let newCategory = formData.category;
    
    if (text.includes('pizza') || text.includes('burger') || text.includes('coffee') || text.includes('grocery')) {
      newCategory = 'Food';
    } else if (text.includes('uber') || text.includes('taxi') || text.includes('petrol') || text.includes('gas') || text.includes('bus')) {
      newCategory = 'Transport';
    } else if (text.includes('netflix') || text.includes('spotify') || text.includes('prime')) {
      newCategory = 'Subscription';
      if (!formData.isSubscription) setFormData(prev => ({...prev, isSubscription: true}));
    } else if (text.includes('movie') || text.includes('game')) {
      newCategory = 'Entertainment';
    } else if (text.includes('amazon') || text.includes('mall') || text.includes('clothes')) {
      newCategory = 'Shopping';
    } else if (text.includes('electricity') || text.includes('water') || text.includes('internet')) {
      newCategory = 'Bills';
    }

    if (newCategory !== formData.category) {
      setFormData(prev => ({...prev, category: newCategory}));
    }
  }, [formData.title, formData.notes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/expenses', {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      if (formData.isSubscription) {
        await api.post('/subscriptions', {
          name: formData.title,
          cost: parseFloat(formData.amount),
          billingCycle: 'Monthly',
          category: formData.category,
          nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        });
      }

      setSuccess(true);
      window.dispatchEvent(new Event('dataChanged'));

      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ ...formData, title: '', amount: '', notes: '', tags: '' });
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
          />
          
          {/* Slide-over Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-surface shadow-2xl relative z-10 flex flex-col border-l border-border-main"
          >
            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-text-main">Expense Added!</h3>
                <p className="text-text-secondary mt-2 font-medium">Successfully logged to your dashboard.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-6 py-5 border-b border-border-main flex items-center justify-between shrink-0">
                  <h2 className="text-xl font-bold text-text-main">New Expense</h2>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-hover text-text-secondary transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                  <form id="add-expense-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    <div>
                      <label className="block text-sm font-bold text-text-main mb-2">Amount</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-text-main font-mono text-xl">₹</span>
                        </div>
                        <input
                          required
                          type="number"
                          step="0.01"
                          className="w-full bg-background border border-border-main rounded-2xl py-4 pl-10 pr-4 text-2xl font-mono focus:outline-none focus:border-primary text-text-main transition-colors font-bold"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-main mb-2">Title</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ClipboardDocumentListIcon className="h-5 w-5 text-text-secondary" />
                        </div>
                        <input
                          required
                          type="text"
                          className="input-field pl-10"
                          placeholder="e.g. Netflix, Uber, Pizza"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-text-main mb-2">Category</label>
                        <select 
                          className="input-field"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-text-main mb-2">Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            className="input-field pl-10"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                          />
                          <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-text-secondary pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-main mb-2">Tags</label>
                      <div className="relative mb-2">
                        <TagIcon className="absolute left-3 top-3.5 h-5 w-5 text-text-secondary pointer-events-none" />
                        <input
                          type="text"
                          className="input-field pl-10"
                          placeholder="Comma separated tags"
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-main mb-2">Notes</label>
                      <textarea
                        className="input-field min-h-[100px] resize-none"
                        placeholder="Add any extra details..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-border-main hover:bg-hover transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-primary rounded border-border-main focus:ring-primary accent-primary"
                          checked={formData.isSubscription}
                          onChange={(e) => setFormData({...formData, isSubscription: e.target.checked})}
                        />
                        <span className="font-bold text-text-main">Mark as Recurring Subscription</span>
                      </label>
                    </div>
                  </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border-main bg-surface shrink-0">
                  <button 
                    type="submit" 
                    form="add-expense-form"
                    disabled={loading}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center shadow-lg shadow-primary/20"
                  >
                    {loading ? 'Saving...' : 'Add Expense'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;
