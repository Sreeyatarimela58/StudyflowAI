import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileText, Copy, Download, Layers, Brain, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { downloadPDF } from '../utils/pdfExport';
import { motion } from 'framer-motion';

export function StudySummary() {
  const { id } = useParams();
  const { loadSession } = useStudy();
  const navigate = useNavigate();
  
  const session = loadSession(id);

  if (!session) {
    return (
      <EmptyState 
        title="Session Not Found" 
        description="The study session you are looking for does not exist." 
        action={<Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>}
      />
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(session.summary);
    toast.success('Summary copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    downloadPDF(session);
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
      <motion.div variants={itemVariants} className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-[64px] gap-6">
        <h1 className="text-headline-xl font-display font-bold">
          {session.title || 'Study Summary'}
        </h1>
        <div className="flex gap-4">
          <Button variant="secondary" size="sm" onClick={handleCopy} className="p-4 rounded-full">
            <Copy className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadPDF} className="p-4 rounded-full">
            <Download className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-[32px] w-full">
        <div className="md:col-span-2 space-y-[32px]">
          <motion.div variants={itemVariants}>
            <Card className="p-[40px] md:p-[64px]">
              <h2 className="flex items-center text-headline-lg font-display font-bold mb-8">
                <FileText className="mr-4 h-8 w-8 text-[var(--color-charcoal)]" />
                Comprehensive Summary
              </h2>
              <div className="prose prose-lg max-w-none text-body-lg text-[var(--color-gray)] leading-relaxed">
                {(session.summary || '').split('\n').map((para, i) => (
                  <p key={i} className="mb-6">{para}</p>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-[40px] md:p-[64px] bg-[var(--color-charcoal)] text-[var(--color-surface)] border-none shadow-none">
              <h2 className="flex items-center text-headline-lg font-display font-bold mb-8">
                <CheckCircle2 className="mr-4 h-8 w-8 text-[var(--color-lime)]" />
                AI Recommendations
              </h2>
              <ul className="space-y-6">
                {session.recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="bg-[var(--color-lime)]/20 p-2 rounded-full mt-1">
                      <div className="bg-[var(--color-lime)] h-2 w-2 rounded-full"></div>
                    </div>
                    <span className="text-body-lg text-[var(--color-surface-hover)] opacity-90">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-[32px]">
          <motion.div variants={itemVariants}>
            <Card className="p-[40px] flex flex-col h-full min-h-[300px]">
              <div className="bg-[#E2E3E1] p-4 rounded-[16px] w-fit mb-6">
                <Layers className="h-8 w-8 text-[var(--color-charcoal)]" />
              </div>
              <h3 className="text-headline-lg font-display font-bold mb-3">Flashcards</h3>
              <p className="text-body-lg text-[var(--color-gray)] mb-8">
                {session.flashcards?.length || 0} cards to lock in key terminology.
              </p>
              <Link to={`/study/${id}/flashcards`} className="mt-auto">
                <Button className="w-full">
                  Review Cards
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-[40px] flex flex-col h-full min-h-[300px]">
              <div className="bg-[var(--color-lime)]/20 p-4 rounded-[16px] w-fit mb-6">
                <Brain className="h-8 w-8 text-[var(--color-charcoal)]" />
              </div>
              <h3 className="text-headline-lg font-display font-bold mb-3">Knowledge Quiz</h3>
              <p className="text-body-lg text-[var(--color-gray)] mb-8">
                {session.quiz?.length || 0} questions to test your adaptive retention.
              </p>
              <Link to={`/study/${id}/quiz`} className="mt-auto">
                <Button variant="secondary" className="w-full bg-[var(--color-charcoal)] text-[var(--color-surface)] hover:bg-[var(--color-charcoal)] hover:opacity-90">
                  Start Quiz
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
