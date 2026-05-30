import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, 
  SparklesIcon, MicrophoneIcon
} from '@heroicons/react/24/outline';

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm TeenSpend AI. I can analyze your spending, answer questions, or give suggestions based on your actual data.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "How much did I spend on food?",
    "Show petrol expenses.",
    "Compare this month vs last month.",
    "Where am I overspending?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Mock API call / Backend integration will go here
    setTimeout(() => {
      let aiResponse = "I'm analyzing your data to find the answer...";
      
      if (text.toLowerCase().includes('food')) {
        aiResponse = "Based on your real data, your food spending is ₹2450. That's 29% of your total expenses this month. Your highest day was ₹650. Compared to last month (₹2100), you're up 16%. Suggestion: Try cooking more at home to save!";
      } else if (text.toLowerCase().includes('save')) {
        aiResponse = "Yes, you can save ₹5000 if you cut down your Subscription and Entertainment categories by 20% this month.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 ${isOpen ? 'hidden sm:flex' : 'flex'}`}
      >
        <SparklesIcon className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-96 h-[80vh] sm:h-[600px] surface-card flex flex-col z-50 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold leading-tight">TeenSpend AI</h3>
                  <p className="text-xs text-white/80">Premium Financial Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm font-medium' 
                      : 'bg-surface border border-border-main text-text-main rounded-tl-sm font-medium leading-relaxed'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface border border-border-main rounded-2xl rounded-tl-sm p-4 flex gap-1">
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (only show if no user messages yet or just few) */}
            {messages.length < 3 && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide border-t border-border-main bg-surface">
                {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="whitespace-nowrap px-3 py-1.5 text-xs font-semibold border border-border-main rounded-full text-text-secondary hover:bg-hover transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-border-main bg-surface shrink-0">
              <div className="flex items-center gap-2">
                <button className="p-2 text-text-secondary hover:bg-hover rounded-full transition-colors">
                  <MicrophoneIcon className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your finances..."
                  className="flex-1 bg-background border border-border-main rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-text-main font-medium"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatbot;
