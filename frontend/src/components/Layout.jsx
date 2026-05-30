import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, ChartBarIcon, CalendarIcon, 
  CurrencyDollarIcon, SparklesIcon, StarIcon,
  UserCircleIcon, Bars3Icon, ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import AddExpenseModal from './AddExpenseModal';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AiChatbot from './AiChatbot';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Goals', href: '/goals', icon: StarIcon },
    { name: 'Subscriptions', href: '/subscriptions', icon: CurrencyDollarIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'AI Coach', href: '/coach', icon: SparklesIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main flex">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 256 }}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="hidden md:flex flex-col sidebar-panel z-10 h-screen sticky top-0"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border-main">
          {sidebarOpen ? (
            <span className="text-xl font-bold text-text-main truncate tracking-tight">TeenSpend Pro</span>
          ) : (
            <span className="text-xl font-bold text-text-main mx-auto tracking-tight">TS</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-md hover:bg-slate-100 text-text-secondary">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 mx-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-white font-bold' 
                    : 'text-text-secondary hover:bg-hover'
                } ${!sidebarOpen && 'justify-center mx-0'}`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-border-main">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-text-main truncate">{user?.fullName}</p>
                <p className="text-xs text-text-secondary truncate">Level {user?.level || 1} Saver</p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className={`mt-4 flex items-center w-full px-2 py-2 text-sm font-bold text-danger hover:bg-danger/10 rounded-xl transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {sidebarOpen && <span className="ml-2">Log out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-16 flex items-center justify-between px-6 bg-surface border-b border-border-main sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
             <button className="md:hidden p-2 text-text-secondary" onClick={() => setSidebarOpen(true)}>
               <Bars3Icon className="w-6 h-6" />
             </button>
             
             {/* Search Bar */}
             <div className="hidden sm:flex items-center bg-background px-3 py-2 rounded-xl w-64 border border-border-main">
                <MagnifyingGlassIcon className="w-5 h-5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="bg-transparent border-none outline-none ml-2 text-sm w-full text-text-main placeholder:text-text-muted font-medium"
                />
             </div>
          </div>
          <div className="flex items-center justify-end ml-auto">
            <button 
              onClick={() => setModalOpen(true)}
              className="hidden sm:flex btn-primary items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-lg leading-none">+</span> Quick Add
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile FAB */}
      <button 
        onClick={() => setModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-3xl font-light hover:scale-105 active:scale-95 transition-transform z-20"
      >
        +
      </button>

      {/* Global Modals */}
      <AddExpenseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Floating AI Chatbot */}
      <AiChatbot />
    </div>
  );
};

export default Layout;
