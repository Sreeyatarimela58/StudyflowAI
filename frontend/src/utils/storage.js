const STORAGE_KEY = 'studyflow_sessions';
const VERSION = '1.0';

/**
 * Robustly fetch sessions from local storage.
 * Gracefully handles parsing failures.
 */
export function loadSessions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse StudyFlow sessions from localStorage. Corrupted data detected.', error);
    // Clear only the corrupted key, preventing React crashes
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/**
 * Fetch a specific session by ID.
 * Updates the lastOpenedAt timestamp.
 */
export function loadSession(id) {
  const sessions = loadSessions();
  const sessionIndex = sessions.findIndex(s => s.id === id);
  
  if (sessionIndex === -1) return null;

  // Update last opened timestamp
  const updatedSession = { ...sessions[sessionIndex], lastOpenedAt: new Date().toISOString() };
  sessions[sessionIndex] = updatedSession;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return updatedSession;
}

/**
 * Save a complete new or existing session.
 */
export function saveSession(session) {
  const sessions = loadSessions();
  const now = new Date().toISOString();
  
  const enhancedSession = {
    ...session,
    version: VERSION,
    lastOpenedAt: now,
    createdAt: session.createdAt || now
  };

  const existsIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existsIndex >= 0) {
    sessions[existsIndex] = enhancedSession;
  } else {
    sessions.unshift(enhancedSession);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}

/**
 * Partially update a session (e.g. adding quizResults).
 */
export function updateSession(id, updates) {
  const sessions = loadSessions();
  const index = sessions.findIndex(s => s.id === id);
  
  if (index === -1) return sessions;

  sessions[index] = {
    ...sessions[index],
    ...updates,
    lastOpenedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}

/**
 * Delete a session.
 */
export function deleteSession(id) {
  const sessions = loadSessions();
  const filtered = sessions.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}
