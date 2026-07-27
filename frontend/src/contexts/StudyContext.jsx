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

  return (
    <StudyContext.Provider value={{ 
      sessions, 
      activeSession, 
      setActiveSession,
      saveSession, 
      loadSession, 
      deleteSession 
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => useContext(StudyContext);
