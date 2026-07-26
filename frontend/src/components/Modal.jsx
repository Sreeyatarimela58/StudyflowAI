import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#191314]/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'pointer-events-auto w-full max-w-lg bg-[var(--color-surface)] rounded-[var(--radius-card)] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.1)] relative',
                className
              )}
            >
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-[var(--color-gray)] hover:text-[var(--color-charcoal)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] rounded-full p-1"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </button>
              
              {title && (
                <h2 className="text-2xl font-display font-semibold mb-6 pr-8">
                  {title}
                </h2>
              )}
              
              <div className="relative">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
