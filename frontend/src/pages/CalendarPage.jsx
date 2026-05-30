import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

const CalendarPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
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
    const fetchExpenses = () => {
      api.get('/expenses').then(res => {
        setExpenses(res.data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    };
    fetchExpenses();
    window.addEventListener('dataChanged', fetchExpenses);
    return () => window.removeEventListener('dataChanged', fetchExpenses);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Food': return 'bg-success text-white';
      case 'Transport': return 'bg-warning text-white';
      case 'Entertainment': return 'bg-primary text-white';
      case 'Shopping': return 'bg-danger text-white';
      case 'Subscription': return 'bg-[#7C6CFF] text-white';
      default: return 'bg-text-secondary text-white';
    }
  };

  const getDayDetails = (dateStr) => {
    const dayExpenses = expenses.filter(e => e.date === dateStr);
    const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryCount = dayExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    const topCategory = Object.keys(categoryCount).length > 0 ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b) : 'None';
    return { dayExpenses, dayTotal, topCategory };
  };

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  const currentMonthTotal = expenses.filter(e => new Date(e.date).getMonth() === currentDate.getMonth()).reduce((sum, e) => sum + e.amount, 0);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-background border border-border-main/50 opacity-50"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const { dayExpenses, dayTotal } = getDayDetails(dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div 
        key={i} 
        onClick={() => setSelectedDay(dateStr)}
        className={`min-h-[120px] p-2 border border-border-main/50 bg-surface hover:bg-hover transition-colors cursor-pointer flex flex-col group ${isToday ? 'bg-primary/5' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
           <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-text-secondary group-hover:text-primary transition-colors'}`}>
             {i}
           </span>
           {dayTotal > 0 && (
             <span className="text-xs font-mono font-bold text-text-main">
               ₹{dayTotal.toFixed(0)}
             </span>
           )}
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          {dayExpenses.slice(0, 3).map((e, idx) => (
            <div key={idx} className={`text-xs px-1.5 py-0.5 rounded truncate font-medium ${getCategoryColor(e.category)}`}>
              {e.title}
            </div>
          ))}
          {dayExpenses.length > 3 && (
            <div className="text-xs font-semibold text-text-secondary pl-1">+{dayExpenses.length - 3} more</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-text-main">Calendar</h2>
          <p className="text-text-secondary font-medium mt-1">
            Total this month: <span className="font-mono font-bold text-text-main">₹{currentMonthTotal.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border-main shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-hover rounded-lg text-text-secondary transition-colors"><ChevronLeftIcon className="w-5 h-5"/></button>
          <span className="font-bold w-40 text-center text-text-main">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-hover rounded-lg text-text-secondary transition-colors"><ChevronRightIcon className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-7 bg-surface border-b border-border-main">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-text-secondary uppercase tracking-wider border-r border-border-main/50 last:border-r-0">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-border-main gap-[1px]">
          {days}
        </div>
      </div>

      {/* Day Details Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="surface-card w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
            >
              {(() => {
                const { dayExpenses, dayTotal, topCategory } = getDayDetails(selectedDay);
                const displayDate = new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                return (
                  <>
                    <div className="p-6 border-b border-border-main flex justify-between items-start bg-background">
                       <div>
                         <h3 className="text-xl font-bold text-text-main">{displayDate}</h3>
                         <div className="flex gap-4 mt-2 text-sm text-text-secondary font-medium">
                           <span>Total: <strong className="text-text-main">₹{dayTotal.toFixed(2)}</strong></span>
                           <span>Top: <strong className="text-text-main">{topCategory}</strong></span>
                         </div>
                       </div>
                       <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-hover rounded-full text-text-secondary transition-colors"><XMarkIcon className="w-5 h-5"/></button>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-3">
                      {dayExpenses.length > 0 ? dayExpenses.map(exp => (
                         <div key={exp.id} className="flex justify-between items-center p-4 border border-border-main rounded-xl bg-surface">
                           <div className="flex items-center gap-3">
                             <div className={`w-3 h-3 rounded-full ${getCategoryColor(exp.category).split(' ')[0]}`}></div>
                             <div>
                               <p className="font-bold text-text-main">{exp.title}</p>
                               <p className="text-xs font-semibold text-text-secondary">{exp.category}</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4">
                             <span className="font-mono font-bold text-text-main">₹{exp.amount.toFixed(2)}</span>
                             <button onClick={() => setExpenseToDelete(exp)} className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all">
                               <TrashIcon className="w-5 h-5" />
                             </button>
                           </div>
                         </div>
                      )) : (
                         <div className="text-center py-8 text-text-secondary font-semibold">No expenses recorded.</div>
                      )}
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-surface border border-border-main text-text-main px-6 py-3 rounded-xl shadow-lg z-50 font-semibold flex items-center gap-2">
          <span>{toastMessage.includes('Could not') ? '⚠️' : '✅'}</span> {toastMessage}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-text-main/20 backdrop-blur-sm">
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
    </div>
  );
};

export default CalendarPage;
