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
        <h1 className="text-headline-xl font-display font-bold text-[#7B1E2B]">
          {session.title || 'Study Summary'}
        </h1>
        <div className="flex gap-4">
          <Button variant="secondary" size="sm" onClick={handleCopy} className="p-4 rounded-full border-2 border-[#c3cf33]">
            <Copy className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadPDF} className="p-4 rounded-full border-2 border-[#c3cf33]">
            <Download className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-[32px] w-full">
        <div className="md:col-span-2 space-y-[32px]">
          <motion.div variants={itemVariants}>
            <Card className="p-[40px] md:p-[64px] border-2 border-[#c3cf33]">
              <h2 className="flex items-center text-headline-lg font-display font-bold mb-8 text-black">
                <FileText className="mr-4 h-8 w-8 text-black" />
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
            <Card className="p-[40px] md:p-[64px] bg-white border-2 border-[#c3cf33] shadow-none text-[var(--color-charcoal)]">
              <h2 className="flex items-center text-headline-lg font-display font-bold mb-8 text-black">
                <CheckCircle2 className="mr-4 h-8 w-8 text-[#c3cf33]" />
                AI Recommendations
              </h2>
              <ul className="space-y-6">
                {session.recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="bg-[#c3cf33]/20 p-2 rounded-full mt-1">
                      <div className="bg-[#c3cf33] h-2 w-2 rounded-full"></div>
                    </div>
                    <span className="text-body-lg text-[var(--color-charcoal)] opacity-90">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {session.quizResults && (
            <motion.div variants={itemVariants}>
              <Card className="p-[40px] md:p-[64px] bg-white border-2 border-[#c3cf33] shadow-none text-[var(--color-charcoal)]">
                <h2 className="flex items-center text-headline-lg font-display font-bold mb-8 text-black">
                  <Brain className="mr-4 h-8 w-8 text-[#c3cf33]" />
                  Detailed Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4">Strong Areas</h3>
                    <ul className="list-disc list-inside text-green-700 space-y-2">
                      <li>Understanding core concepts</li>
                      <li>Basic terminology</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-4">Areas to Focus</h3>
                    <ul className="list-disc list-inside text-red-700 space-y-2">
                      <li>Advanced application</li>
                      <li>Specific edge cases</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-[32px]">
          <motion.div variants={itemVariants}>
            <Card className="p-[40px] flex flex-col h-full min-h-[300px] border-2 border-[#c3cf33]">
              <div className="bg-[#E2E3E1] p-4 rounded-[16px] w-fit mb-6">
                <Layers className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-headline-lg font-display font-bold mb-3 text-black">Flashcards</h3>
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
            <Card className="p-[40px] flex flex-col h-full min-h-[300px] border-2 border-[#c3cf33] relative">
              <div className="bg-[#c3cf33]/20 p-4 rounded-[16px] w-fit mb-6">
                <Brain className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-headline-lg font-display font-bold mb-3 text-black">Knowledge Quiz</h3>
              
              {session.quizResults ? (
                <>
                  <div className="absolute top-8 right-8 bg-[#ECF95A] text-black px-3 py-1 rounded-full text-xs font-bold border-2 border-black">
                    ATTEMPTED
                  </div>
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-5xl font-display font-bold text-[#7B1E2B]">{session.quizResults.score}%</span>
                    <span className="text-body-md text-gray-500 font-bold mb-2 uppercase">Score</span>
                  </div>
                  <Link to={`/study/${id}/quiz`} className="mt-auto">
                    <Button className="w-full bg-[#7B1E2B] text-white hover:bg-[#8B1E3F] border-none">
                      Re-attempt Quiz
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-body-lg text-[var(--color-gray)] mb-8">
                    {session.quiz?.length || 0} questions to test your adaptive retention.
                  </p>
                  <Link to={`/study/${id}/quiz`} className="mt-auto">
                    <Button className="w-full bg-[#ECF95A] text-black hover:bg-[#c3cf33] border-none">
                      Start Quiz
                    </Button>
                  </Link>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
