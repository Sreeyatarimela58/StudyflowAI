import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, ArrowRight, History } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { EmptyState } from '../components/EmptyState';

export function QuizReview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try to get results from router state, otherwise fallback to context or redirect
  const initialResults = location.state?.results || [];
  const incorrectResults = initialResults.filter(r => !r.isCorrect);

  if (incorrectResults.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <EmptyState 
          title="Nothing to review!" 
          message="You got everything right, or there are no results available." 
        />
        <button 
          onClick={() => navigate(`/study/${id}/summary`)}
          className="mt-8 bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[14px] hover:scale-105 transition-transform"
        >
          Return to Summary
        </button>
      </div>
    );
  }

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
    <motion.main 
      className="flex-grow w-full max-w-[1280px] mx-auto px-[20px] md:px-[64px] py-16 md:py-[120px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.header variants={itemVariants} className="mb-16 md:mb-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-container-high)] dark:bg-[#1A1A1A] border border-[var(--color-charcoal)]/10 dark:border-[#333333] mb-8">
          <History className="w-4 h-4 text-[var(--color-secondary)] dark:text-gray-400" />
          <span className="font-label text-[12px] text-[var(--color-secondary)] dark:text-gray-400 uppercase tracking-widest font-bold">Quiz Review</span>
        </div>
        <h1 className="font-display text-[48px] md:text-[77px] font-extrabold tracking-[-0.05em] leading-[0.95] text-[var(--color-primary)] dark:text-white mb-6 text-balance">
          Review Mistakes
        </h1>
        <p className="font-body text-[23px] text-[var(--color-on-surface-variant)] dark:text-gray-400 max-w-2xl leading-relaxed">
          You missed {incorrectResults.length} question{incorrectResults.length === 1 ? '' : 's'} on your recent quiz. Reviewing these now will help solidify the concepts in your long-term memory.
        </p>
      </motion.header>

      {/* Questions List */}
      <div className="flex flex-col gap-12 md:gap-16">
        {incorrectResults.map((result, index) => {
          const q = result.question;
          const isMultipleChoice = q.type !== 'fill-in-the-blank';
          
          return (
            <motion.article 
              key={index} 
              variants={itemVariants}
              className="bg-white dark:bg-[#1A1A1A] rounded-[32px] p-6 md:p-[40px] border border-[var(--color-primary)]/5 dark:border-[#333333] border-4 dark:border-4 dark:border-[#333333] shadow-none relative overflow-hidden group"
            >
              {/* Subtle background accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-error)]/20 dark:bg-red-900/40"></div>
              
              <div className="flex justify-between items-start mb-8">
                <span className="font-label text-[12px] font-bold text-[var(--color-secondary)] dark:text-gray-400 uppercase tracking-widest">Question {index + 1}</span>
                <span className="bg-[#f4f4f2] dark:bg-[#333333] border border-[var(--color-charcoal)]/10 dark:border-[#555] text-[var(--color-on-surface-variant)] dark:text-gray-300 px-3 py-1.5 rounded-full font-label text-[12px] font-bold uppercase">
                  {isMultipleChoice ? 'Multiple Choice' : 'Fill in the Blank'}
                </span>
              </div>
              
              <h3 className="font-display text-[28px] md:text-[37px] font-semibold text-black dark:text-white mb-10 max-w-4xl leading-snug">
                {q.question}
              </h3>
              
              <div className={`grid grid-cols-1 ${isMultipleChoice ? 'lg:grid-cols-2' : ''} gap-6 lg:gap-[24px] mb-10`}>
                
                {/* Wrong Answer */}
                <div className="bg-[var(--color-sage)] dark:bg-[#222] border border-[var(--color-error)]/20 dark:border-red-900/40 rounded-2xl p-6 flex gap-4">
                  <XCircle className="w-6 h-6 text-[var(--color-error)] dark:text-[#ff8989] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-label text-[12px] font-bold text-[var(--color-error)] dark:text-[#ff8989] uppercase mb-3 tracking-wider">Your Answer</p>
                    <div className="relative inline-block">
                      <p className="font-body text-[23px] text-[#93000a] dark:text-[#ffb4ab] font-medium">{result.userAnswer || "No answer provided"}</p>
                      <div className="absolute left-0 top-1/2 w-full h-[2px] bg-[var(--color-error)] dark:bg-[#ff8989] opacity-60"></div>
                    </div>
                    {isMultipleChoice && (
                      <p className="font-body text-[16px] text-black dark:text-gray-300 mt-3">
                        {q.explanation || "This answer is incorrect based on the core principles of the topic."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="bg-[var(--color-sage)] dark:bg-[#222] border border-[var(--color-secondary)]/20 dark:border-[#ECF95A]/20 rounded-2xl p-6 flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#626655] dark:text-[#ECF95A] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-label text-[12px] font-bold text-[#626655] dark:text-[#ECF95A] uppercase mb-3 tracking-wider">Correct Answer</p>
                    <p className="font-body text-[23px] text-[var(--color-charcoal)] dark:text-white font-semibold">{q.options ? q.options[q.correctIndex] : q.correctAnswer}</p>
                    {isMultipleChoice && (
                      <p className="font-body text-[16px] text-[var(--color-on-surface-variant)] dark:text-gray-300 mt-3">
                        {q.explanation || "This is the officially recognized correct terminology and concept."}
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Row */}
              <div className="flex justify-end pt-8 border-t border-[var(--color-charcoal)]/10 dark:border-[#333333]">
                <button 
                  onClick={() => navigate(`/study/${id}/quiz`, { state: { questionsToRetake: [q] } })}
                  className="inline-flex items-center gap-3 border border-black dark:border-[#ECF95A] text-black dark:text-[#ECF95A] px-8 py-4 rounded-full hover:bg-[var(--color-surface-hover)] dark:hover:bg-[#333333] transition-colors duration-200 font-bold"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="font-label text-[12px] font-bold uppercase tracking-widest">Retake Question</span>
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Completion Action */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center mt-12 md:mt-20 gap-4">
        <button 
          onClick={() => navigate(`/study/${id}/quiz`, { state: { questionsToRetake: incorrectResults.map(r => r.question) } })}
          className="inline-flex items-center justify-center gap-3 bg-[#7B1E2B] text-white border-2 border-black dark:border-[#333333] px-10 py-5 rounded-full hover:bg-[#8B1E3F] transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="font-label text-[14px] uppercase font-bold tracking-widest">Retake Incorrect Questions</span>
        </button>
        <button 
          onClick={() => navigate(`/dashboard`)}
          className="inline-flex items-center justify-center gap-3 bg-[#ECF95A] text-black border-2 border-black dark:border-[#333333] px-10 py-5 rounded-full hover:bg-[#c3cf33] transition-colors duration-200"
        >
          <span className="font-label text-[14px] uppercase font-bold tracking-widest">Return to Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.main>
  );
}
