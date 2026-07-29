import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Brain, Layers, ArrowRight } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { EmptyState } from '../components/EmptyState';

export function DailyReview() {
  const { sessions } = useStudy();
  const navigate = useNavigate();

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
    // Shuffle and pick up to 10 for daily review
    return questions.sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [sessions]);

  const [mode, setMode] = useState('hub'); // 'hub', 'quiz', 'flashcards'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const startQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setMode('quiz');
  };

  const startFlashcards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMode('flashcards');
  };

  if (weakQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6">
        <Card className="p-[64px] border-4 border-black dark:border-[#333333] text-center bg-white dark:bg-[#1A1A1A] shadow-none">
          <EmptyState 
            title="You're all caught up!" 
            description="You don't have any weak concepts to review right now. Complete more quizzes to identify areas for improvement."
            icon={Brain}
            action={<Link to="/dashboard"><Button size="lg" className="bg-[#7B1E2B] text-white hover:bg-[#8B1E3F] font-bold">Back to Dashboard</Button></Link>}
          />
        </Card>
      </div>
    );
  }

  const currentQuestion = weakQuestions[currentIndex];
  const progress = (currentIndex / weakQuestions.length) * 100;

  if (mode === 'hub') {
    return (
      <div className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[64px]">
        <div className="w-full flex justify-between items-center mb-[64px]">
          <div>
            <h1 className="text-headline-xl font-display font-bold text-black dark:text-white mb-2">Daily Review</h1>
            <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400">Focusing on your recent weak concepts.</p>
          </div>
          <Link to="/dashboard">
            <Button variant="ghost" className="rounded-full border-2 border-black dark:border-[#333333] hover:bg-[#ECF95A] dark:hover:bg-[#333333] text-black dark:text-white">
              <X className="mr-2 h-5 w-5" /> Close
            </Button>
          </Link>
        </div>

        <div className="w-full grid md:grid-cols-2 gap-[32px] mb-[64px]">
          <Card className="p-[40px] border-4 border-black dark:border-[#333333] bg-white dark:bg-[#1A1A1A] shadow-none h-full flex flex-col justify-between">
            <div>
              <div className="bg-[#ECF95A] dark:bg-black p-4 rounded-[16px] w-fit border-2 border-black dark:border-[#333333] mb-6">
                <Brain className="h-8 w-8 text-black dark:text-[#ECF95A]" />
              </div>
              <h3 className="text-headline-lg font-display font-bold mb-3 text-black dark:text-white">Targeted Quiz</h3>
              <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400 mb-8 font-medium">
                Test yourself on the {weakQuestions.length} concepts you missed recently.
              </p>
            </div>
            <Button size="lg" onClick={startQuiz} className="w-full bg-[#ECF95A] text-black hover:bg-[#c3cf33] border-2 border-black font-bold">
              Start Daily Quiz
            </Button>
          </Card>

          <Card className="p-[40px] border-4 border-black dark:border-[#333333] bg-white dark:bg-[#1A1A1A] shadow-none h-full flex flex-col justify-between">
            <div>
              <div className="bg-[#F4F4F2] dark:bg-black p-4 rounded-[16px] w-fit border-2 border-black dark:border-[#333333] mb-6">
                <Layers className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="text-headline-lg font-display font-bold mb-3 text-black dark:text-white">Flashcards</h3>
              <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400 mb-8 font-medium">
                Quickly memorize the {weakQuestions.length} concepts you missed.
              </p>
            </div>
            <Button size="lg" onClick={startFlashcards} className="w-full bg-black dark:bg-[#333333] text-white hover:bg-black/80 font-bold border-2 border-black dark:border-[#333333]">
              Review Flashcards
            </Button>
          </Card>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-display font-bold mb-6 text-black dark:text-white border-b-4 border-black dark:border-[#333333] pb-4 inline-block">Concepts to Review</h2>
          <div className="space-y-4">
            {weakQuestions.map((q, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1A1A1A] p-6 border-2 border-black dark:border-[#333333] rounded-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#7B1E2B] transition-colors">
                <p className="text-body-lg font-medium text-black dark:text-white line-clamp-2">{q.question}</p>
                <span className="shrink-0 inline-block bg-[#F4F4F2] dark:bg-[#333333] px-3 py-1 rounded-full border border-black dark:border-[#555] text-xs font-bold uppercase text-[var(--color-gray)] dark:text-gray-300">
                  {q.sessionTitle || 'Session'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'quiz') {
    const handleQuizSelect = (index) => {
      if (!isAnswered) setSelectedOption(index);
    };

    const handleQuizSubmit = () => {
      if (!isAnswered && selectedOption !== null) {
        setIsAnswered(true);
      } else if (isAnswered) {
        if (currentIndex < weakQuestions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsAnswered(false);
        } else {
          setMode('hub');
        }
      }
    };

    return (
      <div className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[40px]">
        <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
          <Button variant="ghost" size="sm" onClick={() => setMode('hub')} className="px-4 border-2 border-transparent hover:border-black rounded-full font-bold">
            <X className="mr-2 h-5 w-5" /> Quit
          </Button>
          <div className="text-label-sm font-bold font-mono tracking-wider text-[#7B1E2B] uppercase">
            Question {currentIndex + 1} of {weakQuestions.length}
          </div>
        </div>

        <ProgressBar progress={progress} className="mb-[64px] max-w-4xl w-full" />

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-4xl">
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
                    <button key={idx} onClick={() => handleQuizSelect(idx)} disabled={isAnswered} className={`w-full text-left p-[24px] rounded-[16px] border-2 transition-all duration-300 flex items-center justify-between ${optionStyle}`}>
                      <span className="text-body-lg font-medium">{option}</span>
                      {isAnswered && idx === currentQuestion.correctIndex && <Check className="h-6 w-6 text-green-600" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-[32px] bg-[#ECF95A] rounded-[16px] border-4 border-black">
                  <h4 className="font-bold text-label-sm uppercase tracking-widest text-black mb-3">Explanation</h4>
                  <p className="text-body-lg text-black leading-relaxed font-medium">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="w-full max-w-4xl flex justify-end">
          <Button onClick={handleQuizSubmit} disabled={selectedOption === null} size="lg" className={`w-full sm:w-auto px-12 border-2 border-transparent font-bold ${isAnswered ? 'bg-[#7B1E2B] text-white hover:bg-[#8B1E3F]' : 'bg-black text-white hover:bg-black/80'}`}>
            {isAnswered ? (currentIndex < weakQuestions.length - 1 ? 'Next Question' : 'Finish Quiz') : 'Check Answer'}
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'flashcards') {
    return (
      <div className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[40px]">
        <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
          <Button variant="ghost" size="sm" onClick={() => setMode('hub')} className="px-4 border-2 border-transparent hover:border-black rounded-full font-bold">
            <X className="mr-2 h-5 w-5" /> Quit
          </Button>
          <div className="text-label-sm font-bold font-mono tracking-wider text-[#7B1E2B] uppercase">
            Card {currentIndex + 1} of {weakQuestions.length}
          </div>
        </div>

        <ProgressBar progress={progress} className="mb-[64px] max-w-4xl w-full" />

        <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center relative perspective-1000 mb-[64px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + (isFlipped ? '-flipped' : '-front')}
              initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <Card className="w-full aspect-[4/3] md:aspect-[16/9] flex items-center justify-center p-[40px] text-center border-4 border-black bg-white shadow-none">
                <h2 className="text-headline-lg md:text-headline-xl font-display font-semibold text-black leading-snug">
                  {!isFlipped ? currentQuestion.question : currentQuestion.options[currentQuestion.correctIndex]}
                </h2>
                {isFlipped && (
                  <div className="absolute bottom-6 left-0 right-0 text-center text-sm font-bold text-[#7B1E2B] uppercase">
                    Answer
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-3xl flex justify-between gap-4 mt-auto">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => { setIsFlipped(false); setCurrentIndex(Math.max(0, currentIndex - 1)); }}
            disabled={currentIndex === 0}
            className="flex-1 max-w-[200px] border-2 border-black font-bold"
          >
            Previous
          </Button>
          <Button 
            size="lg" 
            onClick={() => {
              if (currentIndex < weakQuestions.length - 1) {
                setIsFlipped(false);
                setCurrentIndex(currentIndex + 1);
              } else {
                setMode('hub');
              }
            }}
            className="flex-1 max-w-[200px] bg-black text-white hover:bg-black/80 font-bold"
          >
            {currentIndex < weakQuestions.length - 1 ? 'Next' : 'Finish'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }
}
