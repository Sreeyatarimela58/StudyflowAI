import { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as storage from '../utils/storage';
import { generateStudyMaterial, refineSection } from '../services/api';

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  
  // Streaming state
  const streamAbortControllerRef = useRef(null);
  const [streamState, setStreamState] = useState({
    status: 'idle', // idle, connecting, streaming, completed, failed, cancelled
    error: null,
    sessionId: null
  });

  // Refinement state
  const refinementAbortControllersRef = useRef({});
  const [refinements, setRefinements] = useState({}); // { [target]: { isRefining: boolean, error: null } }

  useEffect(() => {
    setSessions(storage.loadSessions());
  }, []);

  const saveSession = (session) => {
    const updatedSessions = storage.saveSession(session);
    setSessions(updatedSessions);
    setActiveSession(session);
  };

  const loadSession = (id) => {
    const loaded = storage.loadSession(id);
    if (loaded && (!activeSession || activeSession.id !== id)) {
      setActiveSession(loaded);
    }
    return loaded;
  };

  const deleteSession = (id) => {
    const updatedSessions = storage.deleteSession(id);
    setSessions(updatedSessions);
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
    if (streamState.sessionId === id) {
      cancelStream();
    }
  };

  const cancelStream = () => {
    if (streamAbortControllerRef.current) {
      streamAbortControllerRef.current.abort();
      streamAbortControllerRef.current = null;
    }
    setStreamState(prev => ({ ...prev, status: 'cancelled' }));
  };

  const generateSession = async (requestData) => {
    setStreamState({ status: 'connecting', error: null, sessionId: null });
    
    try {
      const result = await generateStudyMaterial(
        requestData.title,
        requestData.content,
        requestData.quizMode
      );
      
      const newSessionId = crypto.randomUUID();
      const newSession = {
        id: newSessionId,
        createdAt: new Date().toISOString(),
        quizMode: requestData.quizMode || 'Multiple Choice',
        ...result
      };
      
      saveSession(newSession);
      setStreamState({ status: 'completed', error: null, sessionId: newSessionId });
      return newSessionId;
    } catch (error) {
      console.error('Context Generate Error:', error);
      setStreamState({ status: 'failed', error, sessionId: null });
      throw error;
    }
  };

  const saveQuizResult = async (sessionId, result) => {
    // Save results immediately
    const updatedSessions = storage.updateSession(sessionId, { quizResults: result });
    setSessions(updatedSessions);

    try {
      const currentSessions = storage.loadSessions();
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
        
        const sessionsAfterAnalysis = storage.updateSession(sessionId, {
          aiAnalysis: analysis,
          aiRecommendations: analysis.aiRecommendations // keep existing compatibility
        });
        
        setSessions(sessionsAfterAnalysis);
      }
    } catch (error) {
      console.error('Failed to fetch dynamic AI analysis:', error);
    }
  };

  const refineSessionSection = async (sessionId, target, content, prompt) => {
    // Cancel any previous refinement for this specific target
    if (refinementAbortControllersRef.current[target]) {
      refinementAbortControllersRef.current[target].abort();
    }
    
    const controller = new AbortController();
    refinementAbortControllersRef.current[target] = controller;

    setRefinements(prev => ({
      ...prev,
      [target]: { isRefining: true, error: null }
    }));

    try {
      const session = storage.loadSession(sessionId);
      const result = await refineSection(session.title, target, content, prompt, controller.signal);
      
      if (!controller.signal.aborted) {
        // Incrementally update session
        const updatedSessions = storage.updateSession(sessionId, { [target]: result.data });
        setSessions(updatedSessions);
        setActiveSession(prev => prev?.id === sessionId ? storage.loadSession(sessionId) : prev);

        setRefinements(prev => ({
          ...prev,
          [target]: { isRefining: false, error: null }
        }));
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Refinement Error:', error);
      setRefinements(prev => ({
        ...prev,
        [target]: { isRefining: false, error }
      }));
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
      saveQuizResult,
      generateSession,
      cancelStream,
      streamState,
      refineSessionSection,
      refinements
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => useContext(StudyContext);
