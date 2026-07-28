import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Target, CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export function QuizResults() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const results = location.state?.results || [];
  
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100svh-73px)]">
        <p>No results found.</p>
        <Button onClick={() => navigate(`/study/${id}/summary`)} className="mt-4">Go to Summary</Button>
      </div>
    );
  }

  const total = results.length;
  const correct = results.filter(r => r.isCorrect).length;
  const incorrect = total - correct;
  const score = Math.round((correct / total) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      className="flex flex-col items-center min-h-[calc(100svh-100px)] w-full max-w-[1280px] mx-auto px-6 py-[64px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full text-center mb-[80px]">
        <h1 className="text-headline-xl font-display font-bold mb-4">Quiz Complete!</h1>
        <p className="text-body-lg text-[var(--color-gray)]">Here's how you performed.</p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-[24px] w-full max-w-4xl mb-[80px]">
        <motion.div variants={itemVariants} className="col-span-full md:col-span-1">
          <Card className="p-[40px] flex flex-col items-center justify-center text-center bg-white text-black border-4 border-black h-full min-h-[400px]">
            <div className="relative mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="opacity-20" />
                <motion.circle 
                  cx="64" cy="64" r="56" fill="transparent" stroke="#7B1E2B" strokeWidth="12" 
                  strokeDasharray="351.86" 
                  initial={{ strokeDashoffset: 351.86 }}
                  animate={{ strokeDashoffset: 351.86 - (351.86 * score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-headline-lg font-display font-bold text-black">{score}%</span>
              </div>
            </div>
            <h3 className="text-body-md font-bold uppercase tracking-widest text-black opacity-80">Accuracy</h3>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-full md:col-span-2 grid grid-cols-2 gap-[24px]">
          <Card className="p-[40px] flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-white border-4 border-black">
            <div className="bg-green-100 p-4 rounded-[16px] mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <span className="text-headline-xl font-display font-bold mb-3 text-black">{correct}</span>
            <span className="text-label-sm font-bold uppercase tracking-widest text-black/60">Correct</span>
          </Card>
          
          <Card className="p-[40px] flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-white border-4 border-black">
            <div className="bg-red-100 p-4 rounded-[16px] mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <span className="text-headline-xl font-display font-bold mb-3 text-black">{incorrect}</span>
            <span className="text-label-sm font-bold uppercase tracking-widest text-black/60">Incorrect</span>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-2xl mx-auto">
        {incorrect > 0 && (
          <Button 
            size="lg" 
            className="w-full sm:flex-1 bg-[#ECF95A] text-black hover:bg-[#c3cf33] border-2 border-black"
            onClick={() => navigate(`/study/${id}/quiz/review`, { state: { results } })}
          >
            <RotateCcw className="mr-3 h-5 w-5" />
            Review Incorrect Answers
          </Button>
        )}
        
        <Button 
          size="lg" 
          className="w-full sm:flex-1 bg-[#ECF95A] text-black hover:bg-[#c3cf33] border-2 border-black"
          onClick={() => navigate(`/study/${id}/summary`)}
        >
          Continue to Summary
          <ArrowRight className="ml-3 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
