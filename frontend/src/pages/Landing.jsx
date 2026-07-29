import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export function Landing() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const topMarqueeItems = [
    "AI Powered Learning", "Flashcards", "Quizzes", "Smart Summaries", "PDF Upload", "AI Recommendations", "Study Analytics"
  ];

  const bottomMarqueeItems = [
    "AI Flashcards", "AI Quizzes", "Study Library", "Review Mode", "Progress Tracking", "Interactive Learning", "AI Insights", "Personalized Revision"
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <motion.section 
        className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-20 text-center max-w-[1280px] mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-[53px] md:text-[93px] font-display font-extrabold mb-8 tracking-[-0.05em] leading-[0.95] max-w-5xl mx-auto text-balance text-[var(--color-charcoal)] dark:text-white">
          Transform Notes into <br /> <span className="italic font-normal text-[var(--color-gray)] dark:text-gray-300">Beautiful</span> Learning Experiences.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-[26px] text-[var(--color-gray)] mb-12 max-w-2xl font-body leading-relaxed mx-auto">
          Paste your raw study materials below. Our AI distills chaos into structured flashcards and quizzes, architected for deep retention and focus.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <Link to={user ? "/dashboard" : "/signup"}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#7B1E2B] text-white font-label font-bold text-[21px] uppercase tracking-wider px-8 py-4 rounded-full flex items-center justify-center hover:bg-[#8B1E3F] transition-colors shadow-[0_10px_30px_-10px_rgba(123,30,43,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(123,30,43,0.6)] border-none"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
          </Link>
          {!user && (
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto h-[60px] px-8 rounded-full font-label tracking-wider uppercase border-[var(--color-charcoal)] text-[var(--color-charcoal)] hover:bg-[var(--color-charcoal)]/5 text-[21px]">
                Log In
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section 
        className="bg-transparent py-[120px] px-6 border-t border-[var(--color-charcoal)]/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-[1280px] mx-auto">
          <motion.h2 variants={itemVariants} className="text-[58px] font-display font-extrabold tracking-[-0.05em] leading-[0.95] text-[var(--color-charcoal)] dark:text-white text-center mb-16 max-w-3xl mx-auto">
            The <span className="italic font-normal text-[var(--color-gray)] dark:text-gray-400">architect</span> of your knowledge
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-[24px]">
            <motion.div variants={itemVariants}>
              <Card className="flex flex-col items-start p-[40px] h-full shadow-[var(--shadow-premium)] dark:bg-[#111111] dark:border-[#333333]">
                <div className="bg-[#F4F4F2] dark:bg-black p-4 rounded-[16px] mb-8 dark:border dark:border-[#333333]">
                  <BookOpen className="h-8 w-8 text-[var(--color-charcoal)] dark:text-white" />
                </div>
                <h3 className="text-headline-lg font-display font-semibold mb-4 dark:text-white">Smart Summaries</h3>
                <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400 leading-relaxed">
                  Condense sprawling notes and complex topics into digestible, high-yield study guides.
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="flex flex-col items-start p-[40px] h-full shadow-[var(--shadow-premium)] dark:bg-[#111111] dark:border-[#333333]">
                <div className="bg-[var(--color-lime)]/20 p-4 rounded-[16px] mb-8 dark:border dark:border-[#333333]">
                  <Brain className="h-8 w-8 text-[var(--color-charcoal)] dark:text-[var(--color-lime)]" />
                </div>
                <h3 className="text-headline-lg font-display font-semibold mb-4 dark:text-white">Adaptive Quizzes</h3>
                <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400 leading-relaxed">
                  Test your retention instantly. The AI generates targeted questions and explains exactly why you were wrong.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="flex flex-col items-start p-[40px] h-full shadow-[var(--shadow-premium)] dark:bg-[#111111] dark:border-[#333333]">
                <div className="bg-[#E2E3E1] dark:bg-black p-4 rounded-[16px] mb-8 dark:border dark:border-[#333333]">
                  <Sparkles className="h-8 w-8 text-[var(--color-charcoal)] dark:text-white" />
                </div>
                <h3 className="text-headline-lg font-display font-semibold mb-4 dark:text-white">Interactive Flashcards</h3>
                <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400 leading-relaxed">
                  Flip through automatically generated concepts and definitions to lock in key terminology.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
