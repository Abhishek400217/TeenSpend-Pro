import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, PieChart, LogOut, TrendingUp } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/add-expense', icon: <PlusCircle className="w-5 h-5" />, label: 'Add Expense' },
    { to: '/analytics', icon: <PieChart className="w-5 h-5" />, label: 'Analytics' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <span className="text-2xl font-bold text-slate-900 tracking-tight">TeenSpend</span>
      </div>
      
      <div className="p-6 border-b border-slate-100">
        <p className="text-sm text-slate-500 mb-1">Welcome back,</p>
        <p className="font-semibold text-slate-900 truncate">{user?.fullName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
