import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export function ProgressBar({ progress, className }) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={cn("w-full bg-[#E2E3E1] rounded-full h-1.5 overflow-hidden", className)}>
      <motion.div 
        className="bg-[var(--color-lime)] h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${normalizedProgress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
