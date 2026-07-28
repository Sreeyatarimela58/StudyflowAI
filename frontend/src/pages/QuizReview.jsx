import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

export function QuizReview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialResults = location.state?.results || [];
  const incorrectResults = initialResults.filter(r => !r.isCorrect);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  if (incorrectResults.length === 0) {
    navigate(`/study/${id}/summary`);
    return null;
  }

  const currentResult = incorrectResults[currentIndex];
  const currentQuestion = currentResult.question;
  const progress = (currentIndex / incorrectResults.length) * 100;

  const handleSelect = (index) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (!isAnswered && selectedOption !== null) {
      setIsAnswered(true);
    } else if (isAnswered) {
      if (currentIndex < incorrectResults.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Finished reviewing
        navigate(`/study/${id}/summary`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[40px]">
      <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/study/${id}/summary`)} className="px-4">
          <X className="mr-2 h-5 w-5" />
          Skip Review
        </Button>
        <div className="text-label-sm font-bold font-mono tracking-wider text-[var(--color-error)] uppercase">
          Reviewing {currentIndex + 1} of {incorrectResults.length}
        </div>
      </div>

      <ProgressBar progress={progress} className="mb-[64px] max-w-4xl w-full" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl"
        >
          <Card className="w-full p-[40px] md:p-[64px] shadow-[var(--shadow-premium)] mb-10 border-t-[8px] border-t-[var(--color-error)]">
            <div className="bg-[var(--color-error-bg)] text-[var(--color-error)] px-3 py-1 rounded-full text-label-sm font-bold uppercase tracking-widest w-fit mb-8">
              Incorrectly Answered
            </div>
            <h2 className="text-headline-lg md:text-headline-xl font-display font-semibold mb-10 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle = 'border-[var(--color-charcoal)]/10 hover:border-[var(--color-lime)] hover:bg-[var(--color-surface-hover)]';
                
                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    optionStyle = 'border-green-500 bg-green-50 text-green-900';
                  } else if (isSelected && !currentQuestion.correctIndex !== idx) {
                    optionStyle = 'border-red-500 bg-red-50 text-red-900 opacity-60';
                  } else {
                    optionStyle = 'border-[var(--color-charcoal)]/10 opacity-40';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-[var(--color-lime)] bg-[var(--color-lime)]/10';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-[24px] rounded-[16px] border-[2px] transition-all duration-300 flex items-center justify-between ${optionStyle}`}
                  >
                    <span className="text-body-lg font-medium">{option}</span>
                    {isAnswered && idx === currentQuestion.correctIndex && (
                      <Check className="h-6 w-6 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 p-[32px] bg-[#F4F4F2] rounded-[16px] border border-[var(--color-charcoal)]/5"
              >
                <h4 className="font-bold text-label-sm uppercase tracking-widest text-[var(--color-gray)] mb-3">Explanation</h4>
                <p className="text-body-lg text-[var(--color-gray)] leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-4xl flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={selectedOption === null}
          size="lg"
          className="w-full sm:w-auto px-12"
        >
          {isAnswered ? (
            currentIndex < incorrectResults.length - 1 ? 'Next Question' : 'Finish Review'
          ) : (
            'Check Answer'
          )}
          {isAnswered && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
