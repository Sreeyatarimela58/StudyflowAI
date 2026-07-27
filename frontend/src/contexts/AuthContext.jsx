import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock check for existing session
    const storedUser = localStorage.getItem('studyflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = { id: '1', name: 'Student', email };
          setUser(userData);
          localStorage.setItem('studyflow_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (name, email, password) => {
    // Mock signup API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = { id: '1', name, email };
        setUser(userData);
        localStorage.setItem('studyflow_user', JSON.stringify(userData));
        resolve(userData);
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
