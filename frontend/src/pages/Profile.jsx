import { useNavigate } from 'react-router-dom';
import { User, LogOut, Moon, Sun, Settings, FileText, CheckCircle2, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStudy } from '../contexts/StudyContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export function Profile() {
  const { user, logout } = useAuth();
  const { sessions } = useStudy();
  const { theme, setTheme } = useTheme();
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
        <h1 className="text-headline-xl font-display font-bold mb-4 text-black dark:text-white">Profile</h1>
        <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400">Manage your account and view statistics.</p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-[64px] w-full">
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-[64px]">
          <Card className="p-[64px] md:p-[100px] flex flex-col items-center text-center h-full min-h-[500px] border-4 border-black dark:border-[#333333] bg-white dark:bg-[#1A1A1A] shadow-none">
            <div className="bg-[#E2E3E1] dark:bg-black h-40 w-40 rounded-full flex items-center justify-center mb-10 border-[8px] border-white dark:border-[#333333] shadow-sm">
              <User className="h-20 w-20 text-[var(--color-gray)] dark:text-gray-400" />
            </div>
            <h2 className="text-headline-lg font-display font-bold mb-4 text-black dark:text-white">{user?.name || 'Student'}</h2>
            <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400 mb-12">{user?.email || 'student@example.com'}</p>
            
            <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 mt-auto py-6 text-[20px]" onClick={handleLogout}>
              <LogOut className="mr-4 h-6 w-6" />
              Log Out
            </Button>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 space-y-[64px]">
          <Card className="p-[64px] md:p-[100px] h-full min-h-[500px] border-4 border-black dark:border-[#333333] bg-white dark:bg-[#1A1A1A] shadow-none">
            <h3 className="text-headline-lg font-display font-bold mb-12 text-black dark:text-white">Learning Statistics</h3>
            
            <div className="grid sm:grid-cols-3 gap-[48px]">
              <div className="bg-[#F4F4F2] dark:bg-black p-[48px] rounded-[24px] flex flex-col items-center text-center border-2 border-black dark:border-[#333333]">
                <FileText className="h-12 w-12 text-[var(--color-gray)] dark:text-gray-400 mb-8" />
                <span className="text-headline-xl font-display font-bold mb-4 text-black dark:text-white">{totalSessions}</span>
                <span className="text-label-sm font-bold uppercase tracking-widest text-[var(--color-gray)] dark:text-gray-400">Sessions</span>
              </div>
              
              <div className="bg-[#ECF95A] dark:bg-transparent p-[48px] rounded-[24px] flex flex-col items-center text-center border-2 border-black dark:border-[#333333]">
                <Settings className="h-12 w-12 text-[var(--color-charcoal)] dark:text-[#ECF95A] mb-8" />
                <span className="text-headline-xl font-display font-bold mb-4 text-black dark:text-white">{totalFlashcards}</span>
                <span className="text-label-sm font-bold uppercase tracking-widest text-[var(--color-charcoal-muted)] dark:text-gray-400">Flashcards</span>
              </div>
              
              <div className="bg-[#E2E3E1] dark:bg-[#222222] p-[48px] rounded-[24px] flex flex-col items-center text-center border-2 border-black dark:border-[#333333]">
                <CheckCircle2 className="h-12 w-12 text-black dark:text-white mb-8" />
                <span className="text-headline-xl font-display font-bold mb-4 text-black dark:text-white">{totalQuestions}</span>
                <span className="text-label-sm font-bold uppercase tracking-widest text-black dark:text-gray-300">Questions</span>
              </div>
            </div>
          </Card>

          <Card className="p-[64px] md:p-[100px] border-2 border-black dark:border-[#333333] bg-white dark:bg-[#1A1A1A] shadow-none">
            <h3 className="text-headline-lg font-display font-bold mb-8 text-black dark:text-white flex items-center">
              <Palette className="mr-4 h-8 w-8 text-[#e69532]" />
              Theme Preferences
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 p-8 rounded-[24px] border-4 flex flex-col items-center gap-4 transition-colors ${theme === 'light' ? 'border-black bg-[#ECF95A] text-black' : 'border-transparent bg-[#F4F4F2] dark:bg-[#222] text-gray-500 hover:border-gray-300'}`}
              >
                <Sun className="h-10 w-10" />
                <span className="font-bold text-lg uppercase tracking-widest">Light Mode</span>
              </button>
              
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 p-8 rounded-[24px] border-4 flex flex-col items-center gap-4 transition-colors ${theme === 'dark' ? 'border-white bg-[#7B1E2B] text-white' : 'border-transparent bg-[#F4F4F2] dark:bg-[#222] text-gray-500 hover:border-gray-300'}`}
              >
                <Moon className="h-10 w-10" />
                <span className="font-bold text-lg uppercase tracking-widest">Dark Mode</span>
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
