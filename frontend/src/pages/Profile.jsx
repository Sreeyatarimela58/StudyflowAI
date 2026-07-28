import { useNavigate } from 'react-router-dom';
import { User, LogOut, Moon, Settings, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export function Profile() {
  const { user, logout } = useAuth();
  const { sessions } = useStudy();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Calculate stats
  const totalSessions = sessions.length;
  const totalFlashcards = sessions.reduce((acc, curr) => acc + (curr.flashcards?.length || 0), 0);
  const totalQuestions = sessions.reduce((acc, curr) => acc + (curr.quiz?.length || 0), 0);

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
      className="flex flex-col items-center w-full px-6 py-[64px] md:px-[80px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full mb-[80px] text-center">
        <h1 className="text-headline-xl font-display font-bold mb-4">Profile</h1>
        <p className="text-body-lg text-[var(--color-gray)]">Manage your account and view statistics.</p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-[64px] w-full">
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-[64px]">
          <Card className="p-[64px] md:p-[100px] flex flex-col items-center text-center h-full min-h-[500px] border-2 border-red-500">
            <div className="bg-[#E2E3E1] h-40 w-40 rounded-full flex items-center justify-center mb-10 border-[8px] border-white shadow-sm">
              <User className="h-20 w-20 text-[var(--color-gray)]" />
            </div>
            <h2 className="text-headline-lg font-display font-bold mb-4">{user?.name || 'Student'}</h2>
            <p className="text-body-lg text-[var(--color-gray)] mb-12">{user?.email || 'student@example.com'}</p>
            
            <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 mt-auto py-6 text-[20px]" onClick={handleLogout}>
              <LogOut className="mr-4 h-6 w-6" />
              Log Out
            </Button>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 space-y-[64px]">
          <Card className="p-[64px] md:p-[100px] h-full min-h-[500px] border-2 border-red-500">
            <h3 className="text-headline-lg font-display font-bold mb-12">Learning Statistics</h3>
            
            <div className="grid sm:grid-cols-3 gap-[48px]">
              <div className="bg-[#F4F4F2] p-[48px] rounded-[24px] flex flex-col items-center text-center border-2 border-red-500">
                <FileText className="h-12 w-12 text-[var(--color-gray)] mb-8" />
                <span className="text-headline-xl font-display font-bold mb-4">{totalSessions}</span>
                <span className="text-label-sm font-bold uppercase tracking-widest text-[var(--color-gray)]">Sessions</span>
              </div>
              
              <div className="bg-[var(--color-lime)]/20 p-[48px] rounded-[24px] flex flex-col items-center text-center border-2 border-red-500">
                <Settings className="h-12 w-12 text-[var(--color-charcoal)] mb-8" />
                <span className="text-headline-xl font-display font-bold mb-4">{totalFlashcards}</span>
                <span className="text-label-sm font-bold uppercase tracking-widest text-[var(--color-charcoal-muted)]">Flashcards</span>
              </div>
              
              <div className="bg-green-50 p-[48px] rounded-[24px] flex flex-col items-center text-center border-2 border-red-500">
                <CheckCircle2 className="h-12 w-12 text-green-600 mb-8" />
                <span className="text-headline-xl font-display font-bold mb-4">{totalQuestions}</span>
                <span className="text-label-sm font-bold uppercase tracking-widest text-green-700">Questions</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
