import { createContext, useContext, useState, useEffect } from 'react';

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('studyflow_sessions');
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  const saveSession = (session) => {
    setSessions(prev => {
      // Check if updating existing or adding new
      const exists = prev.findIndex(s => s.id === session.id);
      let updated;
      if (exists >= 0) {
        updated = [...prev];
        updated[exists] = session;
      } else {
        updated = [session, ...prev];
      }
      localStorage.setItem('studyflow_sessions', JSON.stringify(updated));
      return updated;
    });
    setActiveSession(session);
  };

  const loadSession = (id) => {
    return sessions.find(s => s.id === id);
  };

  const deleteSession = (id) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('studyflow_sessions', JSON.stringify(updated));
      return updated;
    });
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
  };

  const saveQuizResult = async (sessionId, result) => {
    // Save results immediately
    setSessions(prev => {
      const exists = prev.findIndex(s => s.id === sessionId);
      if (exists < 0) return prev;
      
      const updated = [...prev];
      updated[exists] = {
        ...updated[exists],
        quizResults: result
      };
      localStorage.setItem('studyflow_sessions', JSON.stringify(updated));
      return updated;
    });

    // Fetch dynamic AI analysis asynchronously
    try {
      const currentSessions = JSON.parse(localStorage.getItem('studyflow_sessions') || '[]');
      const session = currentSessions.find(s => s.id === sessionId);
      
      if (session) {
        const response = await fetch('http://localhost:3001/api/analyze-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionTitle: session.title,
            sessionSummary: session.summary,
            quizResults: result
          })
        });
        
        const analysis = await response.json();
        
        setSessions(prev => {
          const exists = prev.findIndex(s => s.id === sessionId);
          if (exists < 0) return prev;
          
          const updated = [...prev];
          updated[exists] = {
            ...updated[exists],
            aiAnalysis: analysis,
            aiRecommendations: analysis.aiRecommendations // keep existing compatibility
          };
          localStorage.setItem('studyflow_sessions', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to fetch dynamic AI analysis:', error);
    }
  };

  return (
    <StudyContext.Provider value={{ 
      sessions, 
      activeSession, 
      setActiveSession,
      saveSession, 
      loadSession, 
      deleteSession,
      saveQuizResult
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => useContext(StudyContext);
