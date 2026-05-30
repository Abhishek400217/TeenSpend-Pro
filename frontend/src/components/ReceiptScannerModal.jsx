import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CameraIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ReceiptScannerModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: upload/scan, 2: scanning, 3: result

  const handleScan = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
    }, 2500);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="surface-card w-full max-w-lg relative z-10 overflow-hidden flex flex-col min-h-[400px]"
          >
            <div className="p-6 border-b border-border-main flex justify-between items-center bg-background">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                <CameraIcon className="w-6 h-6 text-primary" />
                Smart Receipt Scanner
              </h2>
              <button onClick={handleClose} className="p-2 hover:bg-hover rounded-full text-text-secondary transition-colors">
                <XMarkIcon className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DocumentTextIcon className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-text-main mb-2">Upload or Snap a Receipt</h3>
                  <p className="text-text-secondary font-medium mb-8 text-sm max-w-xs mx-auto">
                    Our AI will automatically extract the merchant, date, total amount, and suggest a category.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button onClick={handleScan} className="btn-primary py-3 px-6 flex items-center gap-2">
                      <CameraIcon className="w-5 h-5" /> Open Camera
                    </button>
                  </div>
                  <div className="mt-6 text-xs text-text-secondary font-medium uppercase tracking-wider">Powered by OCR + AI</div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
                  <div className="relative w-32 h-40 border-2 border-dashed border-primary rounded-xl mb-8 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-primary/20 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(91,91,214,0.8)] animate-[scan_1.5s_ease-in-out_infinite_alternate]"></div>
                    <DocumentTextIcon className="w-16 h-16 text-primary/50" />
                  </div>
                  <h3 className="text-lg font-bold text-text-main mb-2">Analyzing Receipt...</h3>
                  <p className="text-text-secondary font-medium text-sm">Extracting merchant, line items, and totals.</p>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left">
                  <div className="flex items-center gap-3 mb-6 justify-center">
                    <CheckCircleIcon className="w-8 h-8 text-success" />
                    <h3 className="text-xl font-bold text-text-main">Scan Complete</h3>
                  </div>
                  
                  <div className="bg-background border border-border-main rounded-xl p-6 space-y-4">
                    <div className="flex justify-between border-b border-border-main pb-3">
                      <span className="text-text-secondary text-sm font-semibold">Merchant</span>
                      <span className="font-bold text-text-main">Starbucks Coffee</span>
                    </div>
                    <div className="flex justify-between border-b border-border-main pb-3">
                      <span className="text-text-secondary text-sm font-semibold">Date</span>
                      <span className="font-medium text-text-main">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-border-main pb-3">
                      <span className="text-text-secondary text-sm font-semibold">Total Amount</span>
                      <span className="font-mono font-bold text-xl text-text-main">₹450.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-text-secondary text-sm font-semibold">Suggested Category</span>
                      <span className="text-xs font-bold bg-success/10 text-success px-3 py-1 rounded-full">Food</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">Retake</button>
                    <button onClick={handleClose} className="btn-primary flex-1 py-3">Save Expense</button>
                  </div>
                </motion.div>
              )}
            </div>
            {/* Add animation style directly for the scanning line */}
            <style>{`
              @keyframes scan {
                0% { transform: translateY(0); }
                100% { transform: translateY(160px); }
              }
            `}</style>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReceiptScannerModal;
