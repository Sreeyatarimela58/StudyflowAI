import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brain, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { AIErrorState } from '../components/AIErrorState';
import { useStudy } from '../contexts/StudyContext';

export function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { generateSession, streamState } = useStudy();
  const hasStarted = useRef(false);

  const [status, setStatus] = useState('extracting');

  const requestData = location.state;

  const startGeneration = async () => {
    if (!requestData || !requestData.content) {
      navigate('/dashboard/new');
      return;
    }

    setStatus('extracting');
    
    // Start cosmetic timers
    const t1 = setTimeout(() => setStatus('generating'), 1500);
    const t2 = setTimeout(() => setStatus('formatting'), 4500);

    try {
      const sessionId = await generateSession(requestData);
      clearTimeout(t1);
      clearTimeout(t2);
      setStatus('done');
      setTimeout(() => {
        navigate(`/study/${sessionId}/summary`);
      }, 800);
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
    }
  };

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startGeneration();
    }
  }, []);

  const handleRetry = () => {
    startGeneration();
  };

  if (streamState.status === 'failed') {
    return <AIErrorState error={streamState.error} onRetry={handleRetry} />;
  }

  const steps = [
    { id: 'extracting', label: 'Extracting key concepts', icon: FileText },
    { id: 'generating', label: 'Synthesizing knowledge', icon: Brain },
    { id: 'formatting', label: 'Formatting flashcards & quiz', icon: CheckCircle2 }
  ];

  const getCurrentStepIndex = () => {
    if (status === 'done') return 3;
    return steps.findIndex(s => s.id === status);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="w-full p-[64px] flex flex-col items-center text-center shadow-[var(--shadow-premium)]">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-[var(--color-lime)]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-[var(--color-surface)] p-6 rounded-full shadow-sm border border-[var(--color-charcoal)]/10">
              <Loader2 className="h-16 w-16 text-[var(--color-lime-hover)] animate-spin" />
            </div>
          </div>

          <h2 className="text-headline-lg font-display font-bold mb-4">Architecting your study session</h2>
          <p className="text-body-lg text-[var(--color-gray)] mb-12">
            Please wait while the AI structures your material.
          </p>

        <div className="w-full max-w-sm space-y-[32px] text-left">
          {steps.map((step, index) => {
            const isActive = currentIndex === index;
            const isCompleted = currentIndex > index;
            const isPending = currentIndex < index;
            const Icon = step.icon;

            return (
              <motion.div 
                key={step.id} 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-6"
              >
                <div className={`p-3 rounded-full transition-colors duration-500 ${
                  isCompleted ? 'bg-[var(--color-lime)] text-[var(--color-charcoal)]' :
                  isActive ? 'bg-[var(--color-charcoal)] text-[var(--color-surface)] shadow-md' :
                  'bg-[#F4F4F2] text-[var(--color-gray)]'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                <span className={`font-body font-semibold text-body-lg transition-colors duration-500 ${
                  isActive ? 'text-[var(--color-charcoal)]' : 
                  isCompleted ? 'text-[var(--color-gray)]' :
                  'text-[#c5c9b4]'
                }`}>
                  {step.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="ml-auto flex space-x-1"
                  >
                    <span className="w-1.5 h-1.5 bg-[var(--color-charcoal)] rounded-full animate-pulse"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--color-charcoal)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-[var(--color-charcoal)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        </Card>
      </motion.div>
    </div>
  );
}
