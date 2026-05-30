import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { SparklesIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

const AiCoachPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/insights').then(res => {
      setInsights(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
          <SparklesIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-text-main mb-2">Your AI Finance Coach</h2>
        <p className="text-text-secondary font-medium text-lg">Smart recommendations based on your spending patterns.</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="surface-card p-6 flex gap-4 items-start"
          >
            <div className="w-10 h-10 rounded-full bg-background border border-border-main flex items-center justify-center shrink-0 mt-1">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-text-main font-medium leading-relaxed text-lg">{insight}</p>
            </div>
          </motion.div>
        ))}
        {insights.length === 0 && (
          <div className="text-center py-12 text-text-secondary font-semibold">
            <p>No insights yet. Keep tracking your expenses to get personalized tips!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiCoachPage;
