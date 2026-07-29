import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { EmptyState } from '../components/EmptyState';
import { RefinementPanel } from '../components/RefinementPanel';

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
        <Button variant="ghost" onClick={() => navigate(`/study/${id}/summary`)} className="px-6 py-4 text-[24px] text-black dark:text-white">
          <X className="mr-3 h-6 w-6" />
          End Session
        </Button>
        <div className="text-[24px] font-bold font-mono tracking-wider text-[var(--color-gray)] dark:text-gray-400 uppercase">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      <ProgressBar progress={progress} className="mb-[64px] max-w-4xl" />

      <div className="relative w-full max-w-4xl aspect-[4/3] md:aspect-[3/2] perspective-1000">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentCard?.id || (currentIndex + (isFlipped ? '-back' : '-front'))}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7B1E2B] dark:focus-visible:ring-[#ECF95A] rounded-[var(--radius-card)]"
            onClick={() => setIsFlipped(!isFlipped)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped(!isFlipped);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={isFlipped ? "Flashcard definition. Press Space to flip back." : "Flashcard concept. Press Space to flip."}
          >
            <Card className={`w-full h-full p-4 text-center shadow-[var(--shadow-premium)] border-4 border-[#ECF95A] dark:border-[#ECF95A] ${isFlipped ? 'bg-[var(--color-surface)] dark:bg-[#1A1A1A]' : 'bg-[#F4F4F2] dark:bg-black'}`}>
              <div className="w-full h-full flex flex-col items-center justify-center border-4 border-[#7B1E2B] dark:border-[#7B1E2B] relative p-8">
                <span className="absolute top-4 right-6 text-label-sm font-bold uppercase tracking-widest text-[var(--color-gray)] dark:text-gray-400">
                  {isFlipped ? 'Definition' : 'Concept'}
                </span>
                <p className={`text-headline-lg md:text-headline-xl font-display font-semibold leading-tight text-[var(--color-charcoal)] dark:text-white`}>
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
                
                <div className="absolute bottom-4 text-[var(--color-gray)] dark:text-gray-400 text-body-md font-medium flex items-center">
                  Click to flip <span className="ml-3 px-3 py-1 bg-[var(--color-gray-light)] dark:bg-[#333333] dark:text-white rounded-[8px] text-label-sm font-mono hidden sm:inline-block">Space</span>
                </div>
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
          aria-label="Previous card"
          className="w-48 py-6 text-[24px]"
        >
          <ArrowLeft className="mr-4 h-6 w-6" />
          Prev
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleNext} 
          disabled={currentIndex === flashcards.length - 1}
          aria-label="Next card"
          className="w-48 py-6 text-[24px]"
        >
          Next
          <ArrowRight className="ml-4 h-6 w-6" />
        </Button>
      </div>

      <div className="w-full max-w-4xl mt-[32px]">
        <RefinementPanel sessionId={id} target="flashcards" currentContent={flashcards} />
      </div>
    </div>
  );
}
