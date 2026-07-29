import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileText, Copy, Download, Layers, Brain, CheckCircle2, Target } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useStudy } from '../contexts/StudyContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { downloadPDF } from '../utils/pdfExport';
import { motion } from 'framer-motion';
import { RefinementPanel } from '../components/RefinementPanel';

export function StudySummary() {
  const { id } = useParams();
  const { loadSession } = useStudy();
  const navigate = useNavigate();
  
  const session = loadSession(id);

  const strongAreas = session?.aiAnalysis?.strongAreas || ["Understanding core concepts", "Basic terminology"];
  const areasToFocus = session?.aiAnalysis?.areasToFocus || ["Advanced application", "Specific edge cases"];

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const estimatedQuizTime = (session?.quiz?.length || 0) * 30;
  const timeTaken = session?.quizResults?.timeTaken || 0;
  const quizMode = session?.quizMode || 'Multiple Choice';
  const score = session?.quizResults?.score || 0;

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
        <h1 className="text-headline-xl font-display font-bold text-[#7B1E2B] dark:text-[#ECF95A]">
          {session.title || 'Study Summary'}
        </h1>
        <div className="flex gap-4">
          <Button variant="secondary" size="sm" onClick={handleCopy} aria-label="Copy Summary" className="p-4 rounded-full border-2 border-[#c3cf33] dark:border-[#333333] dark:bg-[#1A1A1A] dark:text-white">
            <Copy className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadPDF} aria-label="Export PDF" className="p-4 rounded-full border-2 border-[#c3cf33] dark:border-[#333333] dark:bg-[#1A1A1A] dark:text-white">
            <Download className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col gap-[32px] w-full">
        <div className="w-full space-y-[32px]">
          {session.quizResults && (
            <motion.div variants={itemVariants} className="space-y-[32px]">
              {/* Quiz Statistics Box */}
              <Card className="p-[40px] bg-[#E2E3E1] dark:bg-black border-4 border-black dark:border-[#333333] shadow-none">
                <h2 className="flex items-center text-headline-lg font-display font-bold mb-8 text-black dark:text-white">
                  <Target className="mr-4 h-8 w-8 text-[#7B1E2B] dark:text-[#ECF95A]" />
                  Quiz Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
                  <div className="bg-white dark:bg-[#1A1A1A] p-[32px] rounded-[24px] border-2 border-black dark:border-[#333333] text-center flex flex-col justify-center">
                    <p className="text-lg font-label text-[var(--color-gray)] uppercase tracking-wider mb-4 font-bold">Quiz Mode</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{quizMode}</p>
                  </div>
                  <div className="bg-white dark:bg-[#1A1A1A] p-[32px] rounded-[24px] border-2 border-black dark:border-[#333333] text-center flex flex-col justify-center">
                    <p className="text-lg font-label text-[var(--color-gray)] uppercase tracking-wider mb-4 font-bold">Score</p>
                    <p className="text-3xl font-bold text-[#7B1E2B] dark:text-[#ECF95A]">{score}%</p>
                  </div>
                  <div className="bg-white dark:bg-[#1A1A1A] p-[32px] rounded-[24px] border-2 border-black dark:border-[#333333] text-center flex flex-col justify-center">
                    <p className="text-lg font-label text-[var(--color-gray)] uppercase tracking-wider mb-4 font-bold">Time Taken</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{formatTime(timeTaken)}</p>
                  </div>
                  <div className="bg-white dark:bg-[#1A1A1A] p-[32px] rounded-[24px] border-2 border-black dark:border-[#333333] text-center flex flex-col justify-center">
                    <p className="text-lg font-label text-[var(--color-gray)] uppercase tracking-wider mb-4 font-bold">Est. Time</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{formatTime(estimatedQuizTime)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-[40px] md:p-[64px] bg-white dark:bg-[#1A1A1A] border-4 border-black dark:border-[#333333] shadow-none">
                <h2 className="flex items-center text-headline-xl font-display font-bold mb-12 text-black dark:text-white">
                  <Brain className="mr-4 h-10 w-10 text-[#7B1E2B] dark:text-[#ECF95A]" />
                  Detailed Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-[40px]">
                  <div className="bg-[#F4F4F2] dark:bg-black p-[40px] rounded-[24px] border-4 border-black dark:border-[#333333] hover:border-[#7B1E2B] transition-colors">
                    <h3 className="text-3xl font-display font-bold text-black dark:text-white mb-8">Strong Areas</h3>
                    <ul className="list-disc list-inside text-black dark:text-gray-300 text-xl space-y-4 font-medium leading-relaxed">
                      {strongAreas.map((area, i) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#ECF95A] dark:bg-[#222] p-[40px] rounded-[24px] border-4 border-black dark:border-[#333333] hover:border-[#7B1E2B] transition-colors">
                    <h3 className="text-3xl font-display font-bold text-black dark:text-white mb-8">Areas to Focus</h3>
                    <ul className="list-disc list-inside text-black dark:text-gray-300 text-xl space-y-4 font-medium leading-relaxed">
                      {areasToFocus.map((area, i) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-[32px]">
            {session.summary && (
              <motion.div variants={itemVariants} layout>
                <Card className="p-[40px] md:p-[64px] bg-white dark:bg-[#1A1A1A] border-2 border-[#c3cf33] dark:border-[#333333] h-full flex flex-col">
                  <h2 className="flex items-center text-headline-lg font-display font-bold mb-8 text-black dark:text-white">
                    <FileText className="mr-4 h-8 w-8 text-black dark:text-white" />
                    Comprehensive Summary
                  </h2>
                  <motion.div layout className="prose prose-lg max-w-none text-body-lg text-[var(--color-gray)] dark:text-gray-300 leading-relaxed flex-1">
                    {session.summary.split('\n').map((para, i) => (
                      <p key={i} className="mb-6">{para}</p>
                    ))}
                  </motion.div>
                  <RefinementPanel sessionId={id} target="summary" currentContent={session.summary} />
                </Card>
              </motion.div>
            )}

            {session.recommendations && (
              <motion.div variants={itemVariants}>
                <Card className="p-[40px] md:p-[64px] bg-white dark:bg-[#1A1A1A] border-2 border-[#c3cf33] dark:border-[#333333] shadow-none h-full">
                  <h2 className="flex items-center text-headline-lg font-display font-bold mb-8 text-black dark:text-white">
                    <CheckCircle2 className="mr-4 h-8 w-8 text-[#c3cf33]" />
                    Key Takeaways
                  </h2>
                  <ul className="space-y-6">
                    {session.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="bg-[#c3cf33]/20 p-2 rounded-full mt-1">
                          <div className="bg-[#c3cf33] h-2 w-2 rounded-full"></div>
                        </div>
                        <span className="text-body-lg text-[var(--color-gray)] dark:text-gray-300 leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}
          </div>

          {(session.aiRecommendations || (session.quizResults && session.aiAnalysis)) && (
            <motion.div variants={itemVariants} layout>
              <Card className="p-[40px] md:p-[64px] bg-[#F4F4F2] dark:bg-[#1A1A1A] border-2 border-black dark:border-[#333333] shadow-none h-full flex flex-col">
                <h2 className="flex items-center text-headline-lg font-display font-bold mb-8 text-black dark:text-white">
                  <Brain className="mr-4 h-8 w-8 text-[#7B1E2B] dark:text-[#ECF95A]" />
                  AI Recommendations
                </h2>
                <motion.p layout className="text-body-lg text-[var(--color-gray)] dark:text-gray-300 leading-relaxed flex-1">
                  {session.aiRecommendations || "Based on this session, I recommend focusing on the core concepts first. Try taking the targeted quiz to assess your baseline understanding, then use the flashcards to drill the terminology. Re-read the sections on the more complex topics if your quiz score is below 80%."}
                </motion.p>
                <RefinementPanel sessionId={id} target="recommendations" currentContent={session.aiRecommendations || []} />
              </Card>
            </motion.div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-[32px] w-full mt-[32px]">
          {session.flashcards && (
            <motion.div variants={itemVariants}>
              <Card className="p-[40px] flex flex-col h-full min-h-[300px] border-2 border-[#c3cf33] dark:border-[#333333] bg-white dark:bg-[#1A1A1A]">
                <div className="bg-[#E2E3E1] dark:bg-[#333333] p-4 rounded-[16px] w-fit mb-6">
                  <Layers className="h-8 w-8 text-black dark:text-white" />
                </div>
                <h3 className="text-headline-lg font-display font-bold mb-3 text-black dark:text-white">Flashcards</h3>
                <p className="text-body-lg text-[var(--color-gray)] dark:text-gray-400 mb-8">
                  {session.flashcards.length} cards to lock in key terminology.
                </p>
                <Link to={`/study/${id}/flashcards`} className="mt-auto">
                  <Button className="w-full">
                    Review Cards
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}

          {session.quiz && (
            <motion.div variants={itemVariants}>
              <Card className="p-[40px] flex flex-col h-full min-h-[300px] border-2 border-[#c3cf33] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] relative">
                <div className="bg-[#c3cf33]/20 dark:bg-[#ECF95A]/20 p-4 rounded-[16px] w-fit mb-6">
                  <Brain className="h-8 w-8 text-black dark:text-white" />
                </div>
                <h3 className="text-headline-lg font-display font-bold mb-3 text-black dark:text-white">Knowledge Quiz</h3>
                
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
                      {session.quiz.length} questions to test your adaptive retention.
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
          )}
        </div>
      </div>
    </motion.div>
  );
}
