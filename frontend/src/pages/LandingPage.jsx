import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, ChartBarIcon, FlagIcon, DocumentDuplicateIcon,
  BanknotesIcon, ArrowTrendingUpIcon, LightBulbIcon,
  TrophyIcon, ShieldCheckIcon, EyeIcon, HeartIcon,
  ArrowRightIcon, XMarkIcon, ChevronRightIcon, ChevronLeftIcon, CpuChipIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalContent, setLegalContent] = useState('privacy');
  const [showToast, setShowToast] = useState(false);

  const tourSlides = [
    {
      icon: <ChartBarIcon className="w-12 h-12 text-primary" />,
      title: "Smart Tracking",
      description: "Track every expense in real time.",
      color: "from-primary/20 to-primary/5",
      border: "border-primary/20"
    },
    {
      icon: <CpuChipIcon className="w-12 h-12 text-secondary" />,
      title: "AI Insights",
      description: "Get smart insights and recommendations.",
      color: "from-secondary/20 to-secondary/5",
      border: "border-secondary/20"
    },
    {
      icon: <FlagIcon className="w-12 h-12 text-accent" />,
      title: "Goal Based Saving",
      description: "Set goals and stay motivated.",
      color: "from-accent/20 to-accent/5",
      border: "border-accent/20"
    },
    {
      icon: <TrophyIcon className="w-12 h-12 text-primary" />,
      title: "Build Better Habits",
      description: "Build strong financial habits.",
      color: "from-primary/20 to-primary/5",
      border: "border-primary/20"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % tourSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? tourSlides.length - 1 : prev - 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isTourOpen) return;
      if (e.key === 'Escape') setIsTourOpen(false);
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, currentSlide]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main selection:bg-primary selection:text-white relative overflow-hidden">
      {/* Subtle radial glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Navigation */}
      <nav className="w-full bg-surface/80 backdrop-blur-xl border-b border-border-main py-4 z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
              <span className="text-white font-bold leading-none">T</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-text-main">TeenSpend Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-text-secondary">
            <button onClick={() => scrollTo('features')} className="hover:text-primary transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-primary transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollTo('about')} className="hover:text-primary transition-colors cursor-pointer">About Us</button>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/login" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Log in</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5 shadow-sm shadow-primary/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1: Hero */}
      <section className="pt-24 pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="lg:w-1/2 relative z-10 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-text-main leading-[1.1]">
              Control every rupee.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Build better money habits.</span>
            </h1>
            <p className="text-xl text-text-secondary font-medium mb-10 max-w-lg mx-auto lg:mx-0">
              Track spending, discover patterns, and make smarter financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20 text-lg">
                Get Started
              </Link>
              <button onClick={() => setIsTourOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-surface text-text-main border border-border-main font-bold rounded-2xl hover:bg-hover transition-all active:scale-95 text-lg shadow-sm">
                Product Tour
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating 3D Ecosystem */}
        <div className="lg:w-1/2 w-full h-[600px] flex items-center justify-center relative [perspective:1000px] mt-10 lg:mt-0">
          
          {/* Orbital Lines behind cards */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute w-[300px] h-[300px] rounded-full border border-primary/40"></motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} className="absolute w-[450px] h-[450px] rounded-full border border-secondary/30"></motion.div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="absolute w-[600px] h-[600px] rounded-full border border-accent/20 border-dashed"></motion.div>
          </div>

          {/* Glowing Particles */}
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            <motion.div animate={{ y: [-10, 20, -10], x: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(99,102,241,0.6)]" />
            <motion.div animate={{ y: [15, -15, 15], x: [10, -10, 10], opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-secondary shadow-[0_0_12px_3px_rgba(20,184,166,0.5)]" />
            <motion.div animate={{ y: [0, -20, 0], x: [-10, 10, -10], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }} className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(139,92,246,0.6)]" />
          </div>

          <motion.div 
            animate={{ 
              x: mousePos.x, 
              y: mousePos.y,
              rotateX: mousePos.y * -0.15,
              rotateY: mousePos.x * 0.15
            }}
            transition={{ type: "spring", stiffness: 40, damping: 25 }}
            className="relative w-full max-w-lg aspect-square flex items-center justify-center [transform-style:preserve-3d]"
          >
            {/* Center Logo Cube */}
            <motion.div 
              animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-30 w-36 h-36 bg-gradient-to-br from-primary via-accent to-[#5046E5] rounded-[32px] shadow-[0_20px_50px_-12px_rgba(99,102,241,0.6)] flex items-center justify-center border border-white/20 backdrop-blur-xl transform-gpu"
              style={{ translateZ: "40px" }}
            >
              <div className="w-20 h-20 rounded-[24px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
                <span className="text-white font-bold text-5xl leading-none drop-shadow-md">T</span>
              </div>
            </motion.div>

            {/* Card 1: Top Left - Smart Tracking */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              style={{ x: mousePos.x * 1.5, y: mousePos.y * 1.5, translateZ: "20px" }}
              whileHover={{ y: -8, scale: 1.05, rotate: 0 }}
              className="absolute z-40 top-0 -left-10 w-64 bg-surface/80 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border border-white/60 cursor-default hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.2)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                  <ChartBarIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-text-main text-sm">Smart Tracking</h3>
              </div>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">Track every expense in real-time</p>
            </motion.div>

            {/* Card 2: Top Right - AI Insights */}
            <motion.div 
              animate={{ y: [0, 12, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8, translateZ: "10px" }}
              whileHover={{ y: -8, scale: 1.05, rotate: 0 }}
              className="absolute z-20 top-4 -right-4 md:-right-12 w-64 bg-surface/80 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border border-white/60 cursor-default hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.2)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center border border-secondary/10">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-bold text-text-main text-sm">AI Insights</h3>
              </div>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">Get smart insights and suggestions</p>
            </motion.div>

            {/* Card 3: Bottom Left - Goal Based Saving */}
            <motion.div 
              animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              style={{ x: mousePos.x * 1.2, y: mousePos.y * 1.2, translateZ: "30px" }}
              whileHover={{ y: -8, scale: 1.05, rotate: 0 }}
              className="absolute z-40 bottom-12 -left-4 md:-left-8 w-64 bg-surface/85 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border border-white/60 cursor-default hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.2)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
                  <FlagIcon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-text-main text-sm">Goal Based Saving</h3>
              </div>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">Set goals and stay motivated</p>
            </motion.div>

            {/* Card 4: Bottom Right - Build Better Habits */}
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -1.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{ x: mousePos.x * 2, y: mousePos.y * 2, translateZ: "25px" }}
              whileHover={{ y: -8, scale: 1.05, rotate: 0 }}
              className="absolute z-30 -bottom-8 -right-4 md:-right-8 w-64 bg-surface/85 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border border-white/60 cursor-default hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.2)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                  <TrophyIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-text-main text-sm">Build Better Habits</h3>
              </div>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">Earn rewards and build lifelong habits</p>
            </motion.div>
            
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Feature Grid */}
      <section id="features" className="py-32 px-6 bg-surface/50 border-y border-border-main backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-6">Everything you need to manage money smarter.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface p-8 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SparklesIcon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-main">Smart AI Insights</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Get actionable suggestions on where to save without sacrificing your lifestyle.</p>
            </div>
            <div className="bg-surface p-8 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-main">Advanced Analytics</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Beautiful charts to visualize your spending patterns accurately.</p>
            </div>
            <div className="bg-surface p-8 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FlagIcon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-main">Goal Tracking</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Set savings targets and watch your progress with visual indicators.</p>
            </div>
            <div className="bg-surface p-8 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DocumentDuplicateIcon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-main">Subscription Tracking</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Never pay for forgotten or unused monthly subscriptions again.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 text-text-main">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          
          {/* Animated Line Connector for Desktop */}
          <div className="hidden md:block absolute top-12 left-24 right-24 h-1 bg-gradient-to-r from-primary/10 via-accent/30 to-secondary/10 rounded-full z-0">
            <motion.div 
              animate={{ x: ["0%", "100%", "0%"] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
            <div className="w-24 h-24 rounded-[32px] bg-surface border border-border-main shadow-lg flex items-center justify-center mb-6">
              <BanknotesIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">1. Track</h3>
            <p className="text-text-secondary font-medium text-sm px-4">Log your daily spends easily and accurately.</p>
            <ArrowRightIcon className="w-6 h-6 text-border-main my-4 md:hidden" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
            <div className="w-24 h-24 rounded-[32px] bg-surface border border-border-main shadow-lg flex items-center justify-center mb-6">
              <LightBulbIcon className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">2. Analyze</h3>
            <p className="text-text-secondary font-medium text-sm px-4">Understand exactly where your cash goes.</p>
            <ArrowRightIcon className="w-6 h-6 text-border-main my-4 md:hidden" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
            <div className="w-24 h-24 rounded-[32px] bg-surface border border-border-main shadow-lg flex items-center justify-center mb-6">
              <ArrowTrendingUpIcon className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">3. Improve</h3>
            <p className="text-text-secondary font-medium text-sm px-4">Keep more money and hit your milestones faster.</p>
            <ArrowRightIcon className="w-6 h-6 text-border-main my-4 md:hidden" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
            <div className="w-24 h-24 rounded-[32px] bg-surface border border-border-main shadow-lg flex items-center justify-center mb-6">
              <TrophyIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">4. Build Habits</h3>
            <p className="text-text-secondary font-medium text-sm px-4">Earn rewards and solidify lifelong financial security.</p>
          </div>

        </div>
      </section>

      {/* SECTION 4: Call To Action */}
      <section className="py-40 px-6 bg-surface/50 border-y border-border-main backdrop-blur-sm text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-main">Ready to take control?</h2>
          <p className="text-xl text-text-secondary font-medium mb-12">
            Join today and transform your financial future.
          </p>
          <Link to="/register" className="bg-primary text-white text-lg px-12 py-5 rounded-[24px] font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all inline-block">
            Create free account
          </Link>
        </div>
      </section>

      {/* SECTION 5: ABOUT US */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-main">About TeenSpend Pro</h2>
          <p className="text-xl text-text-secondary font-medium leading-relaxed">
            TeenSpend Pro helps students and young users build smarter money habits through simple tracking, insights, and goal-based financial planning.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface p-10 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-[20px] bg-primary/10 flex items-center justify-center mb-6">
              <FlagIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-text-main">Our Mission</h3>
            <p className="text-text-secondary font-medium leading-relaxed text-lg">To democratize financial literacy by providing intuitive tools that make managing money effortless and highly educational for the next generation.</p>
          </div>
          <div className="bg-surface p-10 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-[20px] bg-secondary/10 flex items-center justify-center mb-6">
              <EyeIcon className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-text-main">Our Vision</h3>
            <p className="text-text-secondary font-medium leading-relaxed text-lg">A world where every young adult steps into independence with absolute confidence and control over their financial wellbeing.</p>
          </div>
          <div className="bg-surface p-10 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-[20px] bg-accent/10 flex items-center justify-center mb-6">
              <HeartIcon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-text-main">Why We Built This</h3>
            <p className="text-text-secondary font-medium leading-relaxed text-lg">Traditional finance apps are overwhelming and built for accountants. We built a solution that speaks human, designed specifically to help young users build habits.</p>
          </div>
          <div className="bg-surface p-10 rounded-[32px] border border-border-main shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-[20px] bg-primary/10 flex items-center justify-center mb-6">
              <ShieldCheckIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-text-main">Your Data, Your Control</h3>
            <p className="text-text-secondary font-medium leading-relaxed text-lg">We believe privacy is a fundamental right. Your financial data is securely encrypted, never sold, and stays entirely in your absolute control.</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <motion.footer 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }}
        className="border-t border-border-main py-20 bg-surface/50 backdrop-blur-sm relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* COLUMN 1 - BRAND */}
            <div className="flex flex-col items-start max-w-[280px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                  <span className="text-white font-bold leading-none">T</span>
                </div>
                <span className="font-bold tracking-tight text-text-main text-xl">TeenSpend Pro</span>
              </div>
              <p className="text-sm text-text-secondary font-medium leading-relaxed">
                Build better money habits for the next generation.
              </p>
            </div>

            {/* COLUMN 2 - SUPPORT */}
            <div className="flex flex-col">
              <h3 className="font-bold text-text-main mb-4">Support</h3>
              <ul className="space-y-3 mb-6">
                <li><a href="mailto:abhishekkarande17@gmail.com" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors inline-block hover:-translate-y-0.5">Contact</a></li>
                <li><a href="mailto:abhishekkarande17@gmail.com" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors inline-block hover:-translate-y-0.5">abhishekkarande17@gmail.com</a></li>
              </ul>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const name = formData.get('name');
                  const email = formData.get('email');
                  const message = formData.get('message');
                  const body = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
                  window.location.href = `mailto:abhishekkarande17@gmail.com?subject=TeenSpend Pro Feedback&body=${body}`;
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                  e.target.reset();
                }}
                className="flex flex-col gap-2"
              >
                <input type="text" name="name" placeholder="Name" required className="w-full bg-surface border border-border-main rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary transition-colors" />
                <input type="email" name="email" placeholder="Email" required className="w-full bg-surface border border-border-main rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary transition-colors" />
                <textarea name="message" placeholder="Message" required rows="2" className="w-full bg-surface border border-border-main rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                <button type="submit" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 text-sm font-bold py-2 rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5">
                  Send Feedback
                </button>
              </form>
            </div>

            {/* COLUMN 3 - LEGAL */}
            <div className="flex flex-col">
              <h3 className="font-bold text-text-main mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><button onClick={() => { setLegalContent('privacy'); setIsLegalModalOpen(true); }} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors inline-block hover:-translate-y-0.5">Privacy Policy</button></li>
                <li><button onClick={() => { setLegalContent('terms'); setIsLegalModalOpen(true); }} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors inline-block hover:-translate-y-0.5">Terms of Service</button></li>
              </ul>
            </div>

            {/* COLUMN 4 - CONNECT */}
            <div className="flex flex-col">
              <h3 className="font-bold text-text-main mb-4">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.linkedin.com/in/abhishekkarande17/" target="_blank" rel="noreferrer" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors inline-block hover:-translate-y-0.5">
                    LinkedIn
                  </a>
                </li>
              </ul>
              <p className="text-xs text-text-secondary mt-4 max-w-[200px] leading-relaxed">Let's connect and build better products.</p>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-border-main pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm font-medium text-text-secondary">© {new Date().getFullYear()} TeenSpend Pro</span>
            <span className="text-sm font-medium text-text-secondary text-center md:text-right">Built by Abhishek Karande for better financial habits tracking</span>
          </div>
        </div>
      </motion.footer>
      {/* Product Tour Modal */}
      <AnimatePresence>
        {isTourOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={() => setIsTourOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface/90 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl p-10 max-w-xl w-full relative overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsTourOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-border-main/50 flex items-center justify-center hover:bg-border-main transition-colors z-10"
              >
                <XMarkIcon className="w-6 h-6 text-text-main" />
              </button>

              <div className="relative h-64 flex flex-col items-center justify-center text-center mt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ x: 50, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -50, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center absolute inset-0 justify-center"
                  >
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${tourSlides[currentSlide].color} border ${tourSlides[currentSlide].border} flex items-center justify-center mb-6 shadow-lg`}>
                      {tourSlides[currentSlide].icon}
                    </div>
                    <h2 className="text-3xl font-bold text-text-main mb-3">{tourSlides[currentSlide].title}</h2>
                    <p className="text-lg text-text-secondary font-medium max-w-sm">{tourSlides[currentSlide].description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="mt-12 flex items-center justify-between relative z-10">
                <button 
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full border border-border-main flex items-center justify-center hover:bg-hover transition-colors text-text-secondary hover:text-text-main"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>

                {/* Progress Indicators */}
                <div className="flex gap-2">
                  {tourSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-border-main hover:bg-text-muted'}`}
                    />
                  ))}
                </div>

                <button 
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors text-white shadow-lg shadow-primary/20"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Modal */}
      <AnimatePresence>
        {isLegalModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={() => setIsLegalModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface/90 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative custom-scrollbar"
            >
              <button 
                onClick={() => setIsLegalModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-border-main/50 flex items-center justify-center hover:bg-border-main transition-colors z-10 sticky float-right"
              >
                <XMarkIcon className="w-6 h-6 text-text-main" />
              </button>
              
              {legalContent === 'privacy' && (
                <div className="text-left mt-2">
                  <h2 className="text-3xl font-bold text-text-main mb-8">Privacy Policy</h2>
                  <div className="space-y-6 text-text-secondary text-sm leading-relaxed pr-4">
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">1. Data Collection</h3>
                      <p>TeenSpend Pro only stores information necessary for app functionality.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">2. Data Protection</h3>
                      <p>User information is encrypted and protected.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">3. No Selling Data</h3>
                      <p>We do not sell personal data.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">4. Cookies</h3>
                      <p>Minimal usage for improving experience.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">5. User Control</h3>
                      <p>Users can request deletion in future versions.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">6. Contact</h3>
                      <p><a href="mailto:abhishekkarande17@gmail.com" className="text-primary hover:underline">abhishekkarande17@gmail.com</a></p>
                    </div>
                  </div>
                </div>
              )}

              {legalContent === 'terms' && (
                <div className="text-left mt-2">
                  <h2 className="text-3xl font-bold text-text-main mb-8">Terms of Service</h2>
                  <div className="space-y-6 text-text-secondary text-sm leading-relaxed pr-4">
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">1. Personal use only</h3>
                      <p>This service is strictly for personal financial tracking.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">2. Do not abuse platform</h3>
                      <p>Any malicious usage will result in an immediate ban.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">3. Features may evolve</h3>
                      <p>We reserve the right to modify or change features.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">4. Data accuracy responsibility</h3>
                      <p>Users are responsible for the accuracy of data inputted.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">5. Service provided as-is</h3>
                      <p>We do not guarantee uninterrupted uptime or availability.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-base mb-1">6. Contact support via email</h3>
                      <p><a href="mailto:abhishekkarande17@gmail.com" className="text-primary hover:underline">abhishekkarande17@gmail.com</a></p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] bg-surface/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center border border-success/20">
              <ShieldCheckIcon className="w-6 h-6 text-success" />
            </div>
            <span className="font-bold text-text-main text-sm">Thanks for reaching out!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
