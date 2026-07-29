import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { EmptyState } from '../components/EmptyState';

export function Quiz() {
  const { id } = useParams();
  const { loadSession } = useStudy();
  const navigate = useNavigate();
  
  const session = loadSession(id);
  const quiz = session?.quiz || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState([]);

  if (!session || quiz.length === 0) {
    return (
      <EmptyState 
        title="No Quiz Available" 
        description="There is no quiz generated for this session." 
        action={<Button onClick={() => navigate(`/study/${id}/summary`)}>Go Back</Button>}
      />
    );
  }

  const currentQuestion = quiz[currentIndex];
  const progress = (currentIndex / quiz.length) * 100;

  const handleSelect = (index) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (!isAnswered && selectedOption !== null) {
      setIsAnswered(true);
      const isCorrect = selectedOption === currentQuestion.correctIndex;
      setResults(prev => [...prev, {
        question: currentQuestion,
        userAnswer: selectedOption,
        isCorrect
      }]);
    } else if (isAnswered) {
      if (currentIndex < quiz.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Finish Quiz
        navigate(`/study/${id}/quiz/results`, { state: { results } });
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[40px]">
      <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/study/${id}/summary`)} className="px-4 text-black dark:text-white">
          <X className="mr-2 h-5 w-5" />
          Quit
        </Button>
        <div className="text-label-sm font-bold font-mono tracking-wider text-[var(--color-gray)] dark:text-gray-400 uppercase">
          Question {currentIndex + 1} of {quiz.length}
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
          <Card className="w-full p-[40px] md:p-[64px] shadow-[var(--shadow-premium)] mb-10 border-4 border-[#ECF95A] bg-white dark:bg-[#1A1A1A]">
            <h2 className="text-headline-lg md:text-headline-xl font-display font-semibold mb-10 leading-snug text-black dark:text-white">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle = 'border-[#7B1E2B] hover:border-[var(--color-lime)] hover:bg-[var(--color-surface-hover)]';
                
                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    optionStyle = 'border-green-500 bg-green-50 text-green-900';
                  } else if (isSelected && !currentQuestion.correctIndex !== idx) {
                    optionStyle = 'border-red-500 bg-red-50 text-red-900 opacity-60';
                  } else {
                    optionStyle = 'border-[#7B1E2B]/40 opacity-40';
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
                    <span className="text-body-lg font-medium dark:text-white">{option}</span>
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
                className="mt-10 p-[32px] bg-[#F4F4F2] dark:bg-black rounded-[16px] border border-[var(--color-charcoal)]/5 dark:border-[#333333]"
              >
                <h4 className="font-bold text-label-sm uppercase tracking-widest text-[var(--color-gray)] dark:text-gray-400 mb-3">Explanation</h4>
                <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-300 leading-relaxed">
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
            currentIndex < quiz.length - 1 ? 'Next Question' : 'View Results'
          ) : (
            'Submit Answer'
          )}
          {isAnswered && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
