import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, FileText, LayoutDashboard, Target, ArrowRight, BrainCircuit, Activity, Award } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { EmptyState } from '../components/EmptyState';

export function Progress() {
  const { id } = useParams();
  const { sessions } = useStudy();
  const navigate = useNavigate();
  
  const session = sessions.find(s => s.id === id);

  if (!session) {
    return <EmptyState title="Session not found" message="This study session could not be found." />;
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  // Mock stats (in a real app, these would come from the backend progress tracker)
  const knowledgeScore = 68;
  const cardsDue = session.flashcards ? Math.min(24, session.flashcards.length) : 0;

  return (
    <motion.div 
      className="flex-1 px-[20px] md:px-[64px] max-w-[1280px] mx-auto w-full py-8 md:py-12 space-y-[120px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section / Topic Header */}
      <motion.section variants={itemVariants} className="space-y-8">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-surface)] rounded-full border border-[var(--color-charcoal)]/10">
            <span className="w-2 h-2 rounded-full bg-[var(--color-lime)]"></span>
            <span className="font-label text-[12px] text-[var(--color-gray)] uppercase tracking-widest font-bold">Active Module</span>
          </div>
          <h2 className="font-display text-[32px] md:text-[48px] font-extrabold text-[var(--color-charcoal)]">{session.title}</h2>
          <p className="font-body text-[18px] text-[var(--color-gray)] max-w-2xl leading-relaxed">
            {session.summary ? session.summary.substring(0, 150) + "..." : "Explore the fundamental principles of this topic."}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 bg-[var(--color-surface)] rounded-[32px] p-[40px] border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)]">
          <div className="flex flex-col space-y-2 border-r border-[var(--color-charcoal)]/10 pr-4">
            <span className="font-label text-[12px] text-[var(--color-gray)] uppercase font-bold">Difficulty</span>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-[#c3cf33]" />
              <span className="font-display text-[24px] md:text-[32px] font-bold text-[var(--color-charcoal)]">Medium</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 border-r border-[var(--color-charcoal)]/10 px-4">
            <span className="font-label text-[12px] text-[var(--color-gray)] uppercase font-bold">Est. Time</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-gray)]">timer</span>
              <span className="font-display text-[24px] md:text-[32px] font-bold text-[var(--color-charcoal)]">45m</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 pl-4">
            <span className="font-label text-[12px] text-[var(--color-gray)] uppercase font-bold">Knowledge Score</span>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-[#c3cf33]" />
              <span className="font-display text-[24px] md:text-[32px] font-bold text-[var(--color-charcoal)]">{knowledgeScore}%</span>
            </div>
            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 bg-[#e8e8e6] rounded-full overflow-hidden mt-2">
              <motion.div 
                className="h-full bg-[var(--color-lime)] rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${knowledgeScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid Content */}
      <motion.section variants={containerVariants} className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">
        {/* Primary Action: Continue Learning */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => navigate(`/study/${id}/summary`)}
          className="md:col-span-8 bg-[var(--color-surface)] rounded-[32px] p-[40px] border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[400px]"
        >
          {/* Abstract Background Graphic */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-[var(--color-lime)]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 bg-[var(--color-charcoal)] rounded-2xl flex items-center justify-center text-white">
              <Play className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-[32px] font-bold text-[var(--color-charcoal)] mb-2">Study Summary</h3>
              <p className="font-body text-[18px] text-[var(--color-gray)] max-w-md">Resume your deep dive into the structured formulations of your notes.</p>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between mt-12 border-t border-[var(--color-charcoal)]/10 pt-6">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#f4f4f2] rounded-full font-label text-[12px] font-bold text-[var(--color-gray)] uppercase tracking-wider">Module 1</span>
              <span className="px-3 py-1 bg-[#f4f4f2] rounded-full font-label text-[12px] font-bold text-[var(--color-gray)] uppercase tracking-wider">Reading</span>
            </div>
            <button className="bg-[var(--color-lime)] text-[var(--color-charcoal)] px-8 py-4 rounded-full font-label text-[12px] uppercase font-bold hover:bg-[#c3cf33] transition-colors flex items-center gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Secondary Action: Active Flashcards */}
        <motion.div 
          variants={itemVariants}
          onClick={() => navigate(`/study/${id}/flashcards`)}
          className="md:col-span-4 bg-[var(--color-surface)] rounded-[32px] p-[40px] border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[400px]"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-[#e8e8e6] rounded-2xl flex items-center justify-center text-[var(--color-charcoal)]">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              {cardsDue > 0 && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-label text-[12px] font-bold uppercase tracking-wider">{cardsDue} Due</span>
              )}
            </div>
            <div>
              <h3 className="font-display text-[28px] font-semibold text-[var(--color-charcoal)] mb-2">Daily Review</h3>
              <p className="font-body text-[16px] text-[var(--color-gray)]">Strengthen neural pathways for key terminology using spaced repetition.</p>
            </div>
          </div>
          <button className="w-full bg-transparent border border-[var(--color-charcoal)] text-[var(--color-charcoal)] px-8 py-4 rounded-full font-label text-[12px] uppercase font-bold hover:bg-[#f4f4f2] transition-colors mt-8">
            Start Session
          </button>
        </motion.div>

        {/* Tertiary: Quiz Mode */}
        <motion.div 
          variants={itemVariants}
          onClick={() => navigate(`/study/${id}/quiz`)}
          className="md:col-span-4 bg-[var(--color-surface)] rounded-[32px] p-[40px] border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] hover:shadow-[var(--shadow-premium-hover)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[250px] group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[#e8e8e6] rounded-xl flex items-center justify-center text-[var(--color-charcoal)]">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-display text-[20px] font-semibold text-[var(--color-charcoal)]">Quiz Mode</h3>
          </div>
          <p className="font-body text-[16px] text-[var(--color-gray)] mb-6">Test your conceptual understanding of the material.</p>
          <div className="flex justify-between items-center text-[#c3cf33] font-label text-[12px] font-bold uppercase tracking-wider group-hover:text-[var(--color-lime)] transition-colors">
            Take Quiz
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Tertiary: Progress Analytics (Knowledge Graph) */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-8 bg-[var(--color-surface)] rounded-[32px] p-[40px] border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] hover:shadow-[var(--shadow-premium-hover)] flex flex-col justify-between min-h-[250px] transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#e8e8e6] rounded-xl flex items-center justify-center text-[var(--color-charcoal)]">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-display text-[20px] font-semibold text-[var(--color-charcoal)]">Knowledge Graph</h3>
            </div>
            <span className="font-label text-[12px] text-[var(--color-gray)] font-bold uppercase tracking-wider">Last 7 Days</span>
          </div>
          
          {/* Abstract Data Visualization */}
          <div className="flex-1 flex items-end gap-2 h-32 pt-4">
            <div className="w-full bg-[#e8e8e6] h-[20%] rounded-t-sm"></div>
            <div className="w-full bg-[#e8e8e6] h-[40%] rounded-t-sm"></div>
            <div className="w-full bg-[var(--color-lime)] h-[75%] rounded-t-sm opacity-80"></div>
            <div className="w-full bg-[#e8e8e6] h-[50%] rounded-t-sm"></div>
            <div className="w-full bg-[#e8e8e6] h-[30%] rounded-t-sm"></div>
            <div className="w-full bg-[var(--color-lime)] h-[90%] rounded-t-sm"></div>
            <div className="w-full bg-[#e8e8e6] h-[60%] rounded-t-sm"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Achievements Section */}
      <motion.section variants={itemVariants} className="space-y-8 pt-8 border-t border-[var(--color-charcoal)]/10">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[24px] font-semibold text-[var(--color-charcoal)]">Recent Milestones</h3>
          <span className="font-label text-[12px] text-[var(--color-gray)] hover:text-[var(--color-charcoal)] font-bold uppercase tracking-wider cursor-pointer transition-colors">View All</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[var(--color-charcoal)]">
              <Award className="h-6 w-6" />
            </div>
            <div className="font-body font-semibold text-[var(--color-charcoal)]">7 Day Streak</div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-lime)]/20 flex items-center justify-center text-[#c3cf33]">
              <Target className="h-6 w-6" />
            </div>
            <div className="font-body font-semibold text-[var(--color-charcoal)]">Perfect Score</div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] flex flex-col items-center text-center space-y-3 opacity-50 grayscale">
            <div className="w-12 h-12 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[var(--color-gray)]">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div className="font-body font-semibold text-[var(--color-gray)]">Topic Master</div>
          </div>
          
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-charcoal)]/5 shadow-[var(--shadow-premium)] flex flex-col items-center text-center space-y-3 opacity-50 grayscale">
            <div className="w-12 h-12 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[var(--color-gray)]">
              <FileText className="h-6 w-6" />
            </div>
            <div className="font-body font-semibold text-[var(--color-gray)]">100 Flashcards</div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
