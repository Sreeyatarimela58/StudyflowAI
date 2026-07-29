import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StudyProvider } from './contexts/StudyContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';

// Placeholder Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { NewStudy } from './pages/NewStudy';
import { Processing } from './pages/Processing';
import { StudySummary } from './pages/StudySummary';
import { Flashcards } from './pages/Flashcards';
import { Quiz } from './pages/Quiz';
import { QuizResults } from './pages/QuizResults';
import { QuizReview } from './pages/QuizReview';
import { Library } from './pages/Library';
import { Profile } from './pages/Profile';
import { Progress } from './pages/Progress';
import { DailyReview } from './pages/DailyReview';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null; // Or a global loading spinner
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col w-full min-h-[calc(100svh-73px)]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/new" element={<ProtectedRoute><NewStudy /></ProtectedRoute>} />
          <Route path="/dashboard/processing" element={<ProtectedRoute><Processing /></ProtectedRoute>} />
          
          <Route path="/daily-review" element={<ProtectedRoute><DailyReview /></ProtectedRoute>} />
          
          <Route path="/study/:id/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/study/:id/summary" element={<ProtectedRoute><StudySummary /></ProtectedRoute>} />
          <Route path="/study/:id/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
          <Route path="/study/:id/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/study/:id/quiz/results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
          <Route path="/study/:id/quiz/review" element={<ProtectedRoute><QuizReview /></ProtectedRoute>} />
          
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <StudyProvider>
            <div className="flex flex-col min-h-screen bg-[var(--color-sage)] dark:bg-black text-[var(--color-charcoal)] dark:text-white font-body transition-colors duration-300">
              <AppRoutes />
            </div>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                className: 'font-body rounded-xl border border-[var(--color-charcoal)]/10 shadow-lg dark:bg-[#1A1A1A] dark:text-white dark:border-white/10',
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-charcoal)',
                }
              }}
            />
          </StudyProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
