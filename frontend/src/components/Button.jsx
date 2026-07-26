import { forwardRef } from 'react';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  isLoading = false, 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-[var(--radius-button)] font-body font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-[var(--color-lime)] text-[var(--color-charcoal)] hover:bg-[var(--color-lime-hover)]',
    secondary: 'bg-transparent border border-[var(--color-charcoal)] text-[var(--color-charcoal)] hover:bg-[var(--color-surface)]',
    ghost: 'bg-transparent text-[var(--color-charcoal)] hover:bg-[var(--color-gray-light)]',
    danger: 'bg-[var(--color-error)] text-white hover:bg-red-700'
  };
  
  const sizes = {
    default: 'px-8 py-4 text-base', // 32px left/right, 16px top/bottom
    sm: 'px-4 py-2 text-sm',
    lg: 'px-10 py-5 text-lg'
  };

  return (
    <motion.button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };
