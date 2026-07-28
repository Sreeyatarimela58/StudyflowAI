import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export function Library() {
  const { sessions, deleteSession } = useStudy();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const filteredSessions = sessions.filter(s => 
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'az') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  const handleDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      toast.success('Session deleted');
      setSessionToDelete(null);
    }
  };

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
      <motion.div variants={itemVariants} className="w-full flex flex-col md:flex-row justify-between md:items-end mb-[64px] gap-6">
        <div>
          <h1 className="text-[72px] font-display font-bold mb-4 leading-none tracking-tight">Study <span className="italic font-normal text-[#7B1E2B]">Library</span></h1>
          <p className="text-body-lg text-[var(--color-gray)] mt-2">All your generated knowledge in one place.</p>
        </div>
        
        <Link to="/dashboard/new">
          <Button className="w-full md:w-auto px-12 py-6 text-[28px] bg-[#ECF95A] text-black hover:bg-[#c3cf33] border-none">Start New Study</Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full flex flex-col sm:flex-row gap-4 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-[var(--color-gray)]" />
          <Input 
            placeholder="Search sessions..." 
            className="pl-14 py-4 text-body-lg border-2 border-[#7B1E2B]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className="rounded-[var(--radius-button)] bg-[#F4F4F2] px-8 py-4 text-body-lg text-[var(--color-charcoal)] border-2 border-[#7B1E2B] focus:outline-none focus:ring-2 focus:ring-[#7B1E2B] cursor-pointer appearance-none font-medium"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">A-Z</option>
        </select>
      </motion.div>

      <motion.div variants={containerVariants} className="w-full">
        {sessions.length === 0 ? (
          <Card className="p-12 border-dashed border-2 bg-transparent shadow-none">
            <EmptyState 
              title="Your library is empty" 
              description="Create your first study session to see it here." 
              action={
                <Link to="/dashboard/new">
                  <Button variant="secondary">Create a study session</Button>
                </Link>
              }
            />
          </Card>
        ) : sortedSessions.length === 0 ? (
          <Card className="p-12 border-dashed border-2 bg-transparent shadow-none">
            <EmptyState 
              title="No results found" 
              description={`We couldn't find any sessions matching "${searchQuery}".`} 
            />
          </Card>
        ) : (
          <div className="grid gap-[24px]">
            {sortedSessions.map(session => (
              <motion.div key={session.id} variants={itemVariants}>
                <Card className="p-[40px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#8B1E3F] transition-colors shadow-sm relative group border-2 border-[#7B1E2B]">
                  <div className="flex items-start gap-6 flex-grow">
                    <div className="bg-[#F4F4F2] p-4 rounded-[16px] hidden sm:block">
                      <Clock className="h-8 w-8 text-[var(--color-gray)]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[32px] text-black mb-3">{session.title || 'Untitled Session'}</h3>
                      <p className="text-body-lg text-[var(--color-charcoal-muted)] line-clamp-2 max-w-3xl mb-4 leading-relaxed">
                        {session.summary}
                      </p>
                      <div className="flex gap-4 text-label-sm font-bold uppercase tracking-widest text-[var(--color-gray)]">
                        <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{session.flashcards?.length || 0} Cards</span>
                        <span>•</span>
                        <span>{session.quiz?.length || 0} Questions</span>
                      </div>
                    </div>
                  </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="ghost" 
                    className="p-4 bg-red-50 text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity rounded-[16px]"
                    onClick={() => setSessionToDelete(session.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    onClick={() => navigate(`/study/${session.id}/summary`)}
                    className="w-full md:w-auto px-8"
                  >
                    Continue
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </div>
              </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal 
        isOpen={!!sessionToDelete} 
        onClose={() => setSessionToDelete(null)}
        title="Delete Session"
      >
        <p className="mb-8 text-[var(--color-charcoal-muted)]">
          Are you sure you want to delete this study session? This action cannot be undone and all generated materials will be lost.
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => setSessionToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </motion.div>
  );
}
