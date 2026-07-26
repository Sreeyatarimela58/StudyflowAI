import { forwardRef } from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Card = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        'bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-charcoal)]/10 p-10 shadow-[var(--shadow-premium)]',
        className
      )}
      whileHover={{ 
        scale: 1.01,
        y: -4,
        boxShadow: "var(--shadow-premium-hover)" 
      }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export { Card };
