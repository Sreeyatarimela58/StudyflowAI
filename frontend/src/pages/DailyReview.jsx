import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Brain } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { EmptyState } from '../components/EmptyState';

export function DailyReview() {
  const { sessions } = useStudy();
  const navigate = useNavigate();

  // Extract all incorrect questions across all sessions
  const weakQuestions = useMemo(() => {
    let questions = [];
    sessions.forEach(session => {
      if (session.quizResults && session.quizResults.details) {
        session.quizResults.details.forEach(detail => {
          if (!detail.isCorrect && detail.question) {
            questions.push({
              ...detail.question,
              sessionId: session.id,
              sessionTitle: session.title
            });
          }
        });
      }
    });
    return questions;
  }, [sessions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (weakQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6">
        <Card className="p-[64px] border-4 border-black text-center bg-white shadow-none">
          <EmptyState 
            title="You're all caught up!" 
            description="You don't have any weak concepts to review right now. Complete more quizzes to identify areas for improvement."
            icon={Brain}
            action={<Link to="/dashboard"><Button size="lg" className="bg-[#7B1E2B] text-white hover:bg-[#8B1E3F]">Back to Dashboard</Button></Link>}
          />
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl text-center">
          <Card className="p-[64px] border-4 border-black bg-[#ECF95A] shadow-none flex flex-col items-center justify-center">
            <h1 className="text-headline-xl font-display font-bold mb-4 text-black">Review Complete!</h1>
            <p className="text-body-lg text-black/80 font-medium mb-8">You've tackled all your weak areas for today.</p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-black text-white hover:bg-black/80 font-bold px-12">Return to Dashboard</Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = weakQuestions[currentIndex];
  const progress = (currentIndex / weakQuestions.length) * 100;

  const handleSelect = (index) => {
    if (!isAnswered) setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (!isAnswered && selectedOption !== null) {
      setIsAnswered(true);
    } else if (isAnswered) {
      if (currentIndex < weakQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setIsComplete(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[40px]">
      <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="px-4 text-black hover:bg-[#F4F4F2] border-2 border-transparent hover:border-black rounded-full">
            <X className="mr-2 h-5 w-5" />
            Exit Review
          </Button>
        </Link>
        <div className="text-label-sm font-bold font-mono tracking-wider text-[#7B1E2B] uppercase">
          Concept {currentIndex + 1} of {weakQuestions.length}
        </div>
      </div>

      <div className="w-full max-w-4xl mb-4 text-center">
         <span className="inline-block bg-[#F4F4F2] px-4 py-2 rounded-full border-2 border-black text-sm font-bold text-black mb-6">
           From Session: {currentQuestion.sessionTitle || 'Untitled'}
         </span>
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
          <Card className="w-full p-[40px] md:p-[64px] shadow-none mb-10 border-4 border-[#7B1E2B] bg-white">
            <h2 className="text-headline-lg md:text-headline-xl font-display font-semibold mb-10 leading-snug text-black">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle = 'border-black hover:bg-[#F4F4F2] text-black';
                
                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    optionStyle = 'border-green-600 bg-green-100 text-green-900';
                  } else if (isSelected && currentQuestion.correctIndex !== idx) {
                    optionStyle = 'border-red-600 bg-red-100 text-red-900';
                  } else {
                    optionStyle = 'border-gray-200 text-gray-400';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-[#7B1E2B] bg-[#7B1E2B]/10 border-4';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-[24px] rounded-[16px] border-2 transition-all duration-300 flex items-center justify-between ${optionStyle}`}
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
                className="mt-10 p-[32px] bg-[#ECF95A] rounded-[16px] border-4 border-black"
              >
                <h4 className="font-bold text-label-sm uppercase tracking-widest text-black mb-3">Explanation</h4>
                <p className="text-body-lg text-black leading-relaxed font-medium">
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
          className={`w-full sm:w-auto px-12 border-2 border-transparent font-bold ${isAnswered ? 'bg-[#7B1E2B] text-white hover:bg-[#8B1E3F]' : 'bg-black text-white hover:bg-black/80'}`}
        >
          {isAnswered ? (
            currentIndex < weakQuestions.length - 1 ? 'Next Concept' : 'Finish Review'
          ) : (
            'Check Answer'
          )}
        </Button>
      </div>
    </div>
  );
}
