import { Link } from 'react-router-dom';
import { Plus, Clock, ChevronRight, FileText, BrainCircuit, Calendar, PlayCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useStudy } from '../contexts/StudyContext';
import { EmptyState } from '../components/EmptyState';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { sessions } = useStudy();
  
  const recentSessions = sessions.slice(0, 5);
  const latestSession = sessions[0];

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
      className="flex flex-col items-center w-full max-w-[1280px] mx-auto px-6 py-[64px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full flex justify-between items-end mb-[60px]">
        <div>
          <h1 className="text-headline-xl font-display font-bold mb-2 text-black dark:text-white">Dashboard</h1>
          <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400">Your learning progress at a glance.</p>
        </div>
        <Link to="/dashboard/new">
          <Button className="bg-[#7B1E2B] text-white hover:bg-[#8B1E3F] border-2 border-black dark:border-[#333333] font-bold">
            <Plus className="mr-2 h-5 w-5" />
            New Study
          </Button>
        </Link>
      </motion.div>

      {/* Top Cards Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full mb-[60px]">
        {/* Daily Review */}
        <motion.div variants={itemVariants} className="col-span-1">
          <Card className="bg-white dark:bg-black border-4 border-black dark:border-[#333333] flex flex-col items-center justify-center p-[40px] min-h-[320px] text-center">
            <Calendar className="h-16 w-16 text-black dark:text-white mb-6" />
            <h3 className="font-display font-bold text-[32px] text-black dark:text-white mb-3">Daily Review</h3>
            <p className="text-lg font-medium text-black/70 dark:text-white/70 mb-6">Focus on your weak concepts across sessions.</p>
            <Link to="/daily-review">
              <Button size="lg" className="border-2 border-transparent bg-[#ECF95A] hover:bg-[#c3cf33] text-black font-bold">
                Start Review
              </Button>
            </Link>
          </Card>
        </motion.div>

        {/* Continue Preparation */}
        <motion.div variants={itemVariants} className="col-span-1">
          <Card className="bg-white dark:bg-black border-4 border-black dark:border-[#333333] flex flex-col items-center justify-center p-[40px] min-h-[320px] text-center">
            <PlayCircle className="h-16 w-16 text-black dark:text-white mb-6" />
            <h3 className="font-display font-bold text-[32px] text-black dark:text-white mb-3">Continue Session</h3>
            {latestSession ? (
              <>
                <p className="text-lg font-medium text-black/70 dark:text-white/70 line-clamp-1 mb-6">{latestSession.title || 'Untitled Session'}</p>
                <Link to={`/study/${latestSession.id}/summary`}>
                  <Button className="bg-[#ECF95A] text-black hover:bg-[#c3cf33] border-2 border-transparent font-bold" size="lg">Resume</Button>
                </Link>
              </>
            ) : (
              <p className="text-sm font-medium text-black/70 dark:text-white/70">No active sessions.</p>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Sessions List */}
      <motion.div variants={containerVariants} className="w-full">
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
          <h2 className="text-headline-lg font-display font-bold text-black dark:text-white">Recent Sessions</h2>
          {sessions.length > 5 && (
            <Link to="/library" className="text-body-md font-bold text-[var(--color-charcoal)] dark:text-gray-400 hover:underline flex items-center">
              View all <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          )}
        </motion.div>

        {recentSessions.length > 0 ? (
          <div className="grid gap-[24px]">
            {recentSessions.map(session => (
              <motion.div key={session.id} variants={itemVariants}>
                <Link to={`/study/${session.id}/summary`} className="block transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                  <Card className="p-[32px] bg-[var(--color-sage)] dark:bg-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between shadow-sm border-2 border-black dark:border-[#333333] hover:border-[#7B1E2B] transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="bg-[#F4F4F2] dark:bg-black p-4 rounded-[16px] hidden sm:block border-2 border-transparent dark:border-[#333333]">
                        <Clock className="h-7 w-7 text-black dark:text-white" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-body-lg md:text-2xl text-black dark:text-white">{session.title || 'Untitled Session'}</h3>
                        <p className="text-body-md text-gray-700 dark:text-gray-300 mt-2">
                          {new Date(session.createdAt).toLocaleDateString()} • {session.flashcards?.length || 0} cards • {session.quiz?.length || 0} questions
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" className="mt-4 sm:mt-0 hidden sm:flex rounded-full border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#ECF95A] dark:hover:bg-white dark:hover:text-black transition-colors">
                      Review
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="p-[80px] border-dashed border-2 border-gray-300 bg-transparent shadow-none text-center">
              <EmptyState 
                title="No recent studies" 
                description="You haven't generated any study materials yet." 
                icon={Clock}
              />
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
