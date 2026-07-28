import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { EmptyState } from '../components/EmptyState';

export function Flashcards() {
  const { id } = useParams();
  const { loadSession } = useStudy();
  const navigate = useNavigate();
  
  const session = loadSession(id);
  const flashcards = session?.flashcards || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (isFlipped) {
          handleNext();
        } else {
          setIsFlipped(true);
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      } else if (e.key === 'Escape') {
        navigate(`/study/${id}/summary`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, id, navigate]);

  if (!session || flashcards.length === 0) {
    return (
      <EmptyState 
        title="No Flashcards" 
        description="There are no flashcards available for this session." 
        action={<Button onClick={() => navigate(`/study/${id}/summary`)}>Go Back</Button>}
      />
    );
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[40px]">
      <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/study/${id}/summary`)} className="px-4">
          <X className="mr-2 h-5 w-5" />
          End Session
        </Button>
        <div className="text-label-sm font-bold font-mono tracking-wider text-[var(--color-gray)] uppercase">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      <ProgressBar progress={progress} className="mb-[64px] max-w-4xl" />

      <div className="relative w-full max-w-4xl aspect-[16/9] md:aspect-[2/1] perspective-1000">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <Card className={`w-full h-full flex flex-col items-center justify-center p-[40px] md:p-[80px] text-center shadow-[var(--shadow-premium)] border-t-[8px] ${isFlipped ? 'border-t-[var(--color-lime)] bg-[var(--color-surface)]' : 'border-t-[var(--color-charcoal)] bg-[#F4F4F2]'}`}>
              <span className="absolute top-8 right-10 text-label-sm font-bold uppercase tracking-widest text-[var(--color-gray)]">
                {isFlipped ? 'Definition' : 'Concept'}
              </span>
              <p className={`text-headline-lg md:text-headline-xl font-display font-semibold leading-tight ${isFlipped ? 'text-[var(--color-charcoal)]' : 'text-[var(--color-charcoal)]'}`}>
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              
              <div className="absolute bottom-8 text-[var(--color-gray)] text-body-md font-medium flex items-center">
                Click to flip <span className="ml-3 px-3 py-1 bg-[var(--color-gray-light)] rounded-[8px] text-label-sm font-mono hidden sm:inline-block">Space</span>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between w-full max-w-4xl mt-[64px]">
        <Button 
          variant="secondary" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="w-40"
        >
          <ArrowLeft className="mr-3 h-5 w-5" />
          Prev
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleNext} 
          disabled={currentIndex === flashcards.length - 1}
          className="w-40"
        >
          Next
          <ArrowRight className="ml-3 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
