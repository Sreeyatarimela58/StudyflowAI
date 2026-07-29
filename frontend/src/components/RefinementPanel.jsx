import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useStudy } from '../contexts/StudyContext';
import { AIErrorState } from './AIErrorState';

export function RefinementPanel({ sessionId, target, currentContent }) {
  const { refineSessionSection, refinements } = useStudy();
  const [prompt, setPrompt] = useState('');

  const refinementState = refinements[target] || { isRefining: false, error: null };
  const { isRefining, error } = refinementState;

  const suggestions = {
    summary: ['Explain More Simply', 'Expand Summary', 'Shorten Summary', 'Add Examples'],
    quiz: ['Harder Questions', 'Easier Questions', 'More Questions'],
    flashcards: ['Add More', 'Simplify'],
    recommendations: ['More Practical', 'Exam Tips']
  };

  const chips = suggestions[target] || [];

  const handleRefine = (textPrompt) => {
    if (!textPrompt.trim() || isRefining) return;
    refineSessionSection(sessionId, target, currentContent, textPrompt);
    setPrompt('');
  };

  return (
    <div className="w-full mt-4 p-4 md:p-6 bg-[#F4F4F2] dark:bg-[#1A1A1A] rounded-[16px] border-2 border-black/10 dark:border-white/10 relative overflow-hidden">
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isRefining && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm"
          >
            <Loader2 className="h-10 w-10 text-[#7B1E2B] dark:text-[#ECF95A] animate-spin mb-4" />
            <p className="text-body-lg font-bold text-black dark:text-white">Refining with AI...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="h-5 w-5 text-[#7B1E2B] dark:text-[#ECF95A]" />
        <h4 className="font-display font-bold text-lg text-black dark:text-white">Improve with AI</h4>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleRefine(chip)}
            className="text-sm font-medium px-4 py-2 rounded-full bg-white dark:bg-[#333] border border-black/10 dark:border-white/10 hover:border-[#7B1E2B] dark:hover:border-[#ECF95A] hover:bg-[#7B1E2B]/5 dark:hover:bg-[#ECF95A]/10 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleRefine(prompt);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Or type a custom instruction..."
          className="flex-1 bg-white dark:bg-[#333] border border-black/10 dark:border-white/10 rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E2B] dark:focus:ring-[#ECF95A]"
        />
        <Button 
          type="submit" 
          disabled={!prompt.trim() || isRefining}
          className="bg-[#7B1E2B] text-white hover:bg-[#8B1E3F] border-none px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7B1E2B] dark:focus-visible:ring-[#ECF95A] dark:focus-visible:ring-offset-[#1A1A1A]"
          aria-label="Submit refinement"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </form>

      {error && (
        <div className="mt-4">
          <AIErrorState 
            error={error} 
            onRetry={() => handleRefine(prompt || 'Try again')} 
          />
        </div>
      )}
    </div>
  );
}
