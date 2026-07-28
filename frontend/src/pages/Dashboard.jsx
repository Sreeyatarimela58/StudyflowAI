import { Link } from 'react-router-dom';
import { Plus, Clock, ChevronRight, FileText } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useStudy } from '../contexts/StudyContext';
import { EmptyState } from '../components/EmptyState';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { sessions } = useStudy();
  
  const allSessions = sessions;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center w-full max-w-[1280px] mx-auto px-6 py-[64px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full flex justify-between items-end mb-[80px]">
        <div>
          <h1 className="text-headline-xl font-display font-bold mb-4">Welcome back.</h1>
          <p className="text-body-lg text-[var(--color-gray)]">Ready to learn something new?</p>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-[24px] w-full mb-[120px]">
        <motion.div variants={itemVariants} className="col-span-full md:col-span-2">
          <Card className="bg-[var(--color-charcoal)] text-[var(--color-surface)] border-none flex flex-col justify-between items-start p-[40px] h-full min-h-[300px]">
            <div>
              <h2 className="text-headline-lg font-display font-semibold mb-4 text-white">Generate new material</h2>
              <p className="text-body-lg text-[var(--color-surface-hover)] opacity-80 max-w-md">
                Paste your notes or enter a topic, and AI will create flashcards, quizzes, and summaries instantly.
              </p>
            </div>
            <Link to="/dashboard/new" className="mt-8">
              <Button className="bg-[var(--color-lime)] text-[var(--color-charcoal)] hover:bg-[var(--color-lime-hover)] px-8 border-none">
                <Plus className="mr-2 h-5 w-5" />
                Start New Study
              </Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1">
          <Card className="bg-[#F4F4F2] border-none flex flex-col justify-center items-center p-[40px] h-full min-h-[300px] text-center shadow-none hover:bg-[#E2E3E1] transition-colors">
            <div className="bg-[var(--color-surface)] p-4 rounded-full mb-6 shadow-sm">
              <FileText className="h-8 w-8 text-[var(--color-charcoal)]" />
            </div>
            <h3 className="font-display font-bold text-headline-xl mb-2">{sessions.length}</h3>
            <p className="text-label-sm font-semibold text-[var(--color-gray)] uppercase tracking-widest">Total Sessions</p>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="w-full">
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
          <h2 className="text-headline-lg font-display font-bold">All Sessions</h2>
        </motion.div>

        {allSessions.length > 0 ? (
          <div className="grid gap-[24px]">
            {allSessions.map(session => (
              <motion.div key={session.id} variants={itemVariants}>
                <Link to={`/study/${session.id}/summary`}>
                  <Card className="p-[40px] flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="bg-[#F4F4F2] p-4 rounded-[16px] hidden sm:block">
                        <Clock className="h-7 w-7 text-[var(--color-gray)]" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-body-lg md:text-2xl">{session.title || 'Untitled Session'}</h3>
                        <p className="text-body-md text-[var(--color-gray)] mt-2">
                          {new Date(session.createdAt).toLocaleDateString()} • {session.flashcards?.length || 0} cards • {session.quiz?.length || 0} questions
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" className="hidden sm:flex rounded-full">
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
            <Card className="p-[80px] border-dashed border-2 bg-transparent shadow-none">
            <EmptyState 
              title="No recent studies" 
              description="You haven't generated any study materials yet." 
              icon={Clock}
              action={
                <Link to="/dashboard/new">
                  <Button variant="secondary">Create your first study</Button>
                </Link>
              }
            />
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
