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
    // Mock login API call against "database"
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Invalid credentials'));
          return;
        }
        const usersDb = JSON.parse(localStorage.getItem('studyflow_users_db') || '[]');
        const user = usersDb.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password, ...userData } = user; // don't store password in active session
          setUser(userData);
          localStorage.setItem('studyflow_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Incorrect email or password'));
        }
      }, 1000);
    });
  };

  const signup = async (name, email, password) => {
    // Mock signup API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersDb = JSON.parse(localStorage.getItem('studyflow_users_db') || '[]');
        if (usersDb.some(u => u.email === email)) {
          reject(new Error('User already exists'));
          return;
        }

        const newUser = { id: Date.now().toString(), name, email, password };
        usersDb.push(newUser);
        localStorage.setItem('studyflow_users_db', JSON.stringify(usersDb));

        const { password: _, ...userData } = newUser;
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
