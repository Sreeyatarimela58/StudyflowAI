import { AlertTriangle, RefreshCw, ServerCrash, Clock, FileWarning } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { motion } from 'framer-motion';

export function AIErrorState({ error, onRetry }) {
  let title = "Something went wrong";
  let message = "We encountered an unexpected error.";
  let Icon = AlertTriangle;
  let color = "text-[#7B1E2B]";
  let bgColor = "bg-[#7B1E2B]/10";

  if (error?.name === 'AIValidationError') {
    title = "We couldn't understand the AI response.";
    message = "The AI generated content that was malformed or incomplete. Please try generating it again.";
    Icon = FileWarning;
  } else if (error?.name === 'AITimeoutError') {
    title = "This is taking longer than expected.";
    message = "The AI is currently under heavy load and timed out. Give it another shot.";
    Icon = Clock;
    color = "text-orange-500";
    bgColor = "bg-orange-500/10";
  } else if (error?.name === 'AINetworkError') {
    title = "Network Error";
    message = error.status === 429 
      ? "You are generating too fast. Please wait a moment and try again."
      : "We couldn't connect to the AI service. Please check your connection.";
    Icon = ServerCrash;
  } else if (error?.message?.includes('empty')) {
    title = "No study content could be generated.";
    message = "The AI returned an empty response. Ensure your notes have enough content.";
    Icon = FileWarning;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto w-full"
    >
      <Card className="p-8 md:p-12 text-center border-2 border-[#7B1E2B] dark:border-[#7B1E2B]/50 bg-white dark:bg-[#1A1A1A]">
        <div className={`mx-auto w-24 h-24 ${bgColor} rounded-full flex items-center justify-center mb-6`}>
          <Icon className={`w-12 h-12 ${color}`} />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-black dark:text-white mb-4">
          {title}
        </h2>
        
        <p className="text-xl text-[var(--color-gray)] mb-10 max-w-lg mx-auto">
          {message}
        </p>

        <Button 
          onClick={onRetry}
          className="bg-[#7B1E2B] text-white hover:bg-[#8B1E3F] border-none text-lg px-8 py-4 h-auto rounded-full w-full sm:w-auto flex items-center justify-center gap-3"
        >
          <RefreshCw className="w-5 h-5" />
          Retry Generation
        </Button>
      </Card>
    </motion.div>
  );
}
