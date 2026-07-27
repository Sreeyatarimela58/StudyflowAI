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

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <motion.section 
        className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-20 text-center max-w-[1280px] mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-charcoal)]/10 px-4 py-2 rounded-full mb-8 shadow-sm">
          <Sparkles className="h-4 w-4 text-[var(--color-lime-hover)]" />
          <span className="text-label-sm uppercase font-mono">AI-Powered Study Assistant</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-display-lg font-display font-extrabold mb-8 tracking-tight leading-tight max-w-4xl mx-auto">
          Master any topic <br className="hidden md:block" />
          with <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-[var(--color-charcoal)]">intelligent</span> focus.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-body-lg text-[var(--color-gray)] mb-12 max-w-2xl font-body leading-relaxed mx-auto">
          Transform raw notes into interactive flashcards, quizzes, and structured summaries in seconds. Stop organizing, start learning.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <Link to={user ? "/dashboard" : "/signup"}>
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          {!user && (
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Log In
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="bg-[var(--color-surface)] py-[120px] px-6 border-t border-[var(--color-charcoal)]/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-[1280px] mx-auto">
          <motion.h2 variants={itemVariants} className="text-headline-xl font-display font-bold text-center mb-16 max-w-3xl mx-auto">
            The architect of your knowledge
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-[24px]">
            <motion.div variants={itemVariants}>
              <Card className="flex flex-col items-start p-[40px] h-full shadow-[var(--shadow-premium)]">
                <div className="bg-[#F4F4F2] p-4 rounded-[16px] mb-8">
                  <BookOpen className="h-8 w-8 text-[var(--color-charcoal)]" />
                </div>
                <h3 className="text-headline-lg font-display font-semibold mb-4">Smart Summaries</h3>
                <p className="text-body-lg text-[var(--color-gray)] leading-relaxed">
                  Condense sprawling notes and complex topics into digestible, high-yield study guides.
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="flex flex-col items-start p-[40px] h-full shadow-[var(--shadow-premium)]">
                <div className="bg-[var(--color-lime)]/20 p-4 rounded-[16px] mb-8">
                  <Brain className="h-8 w-8 text-[var(--color-charcoal)]" />
                </div>
                <h3 className="text-headline-lg font-display font-semibold mb-4">Adaptive Quizzes</h3>
                <p className="text-body-lg text-[var(--color-gray)] leading-relaxed">
                  Test your retention instantly. The AI generates targeted questions and explains exactly why you were wrong.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="flex flex-col items-start p-[40px] h-full shadow-[var(--shadow-premium)]">
                <div className="bg-[#E2E3E1] p-4 rounded-[16px] mb-8">
                  <Sparkles className="h-8 w-8 text-[var(--color-charcoal)]" />
                </div>
                <h3 className="text-headline-lg font-display font-semibold mb-4">Interactive Flashcards</h3>
                <p className="text-body-lg text-[var(--color-gray)] leading-relaxed">
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
