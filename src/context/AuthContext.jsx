import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('jobhive_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const u = { ...userData, token };
    setUser(u);
    localStorage.setItem('jobhive_user', JSON.stringify(u));
    localStorage.setItem('jobhive_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobhive_user');
    localStorage.removeItem('jobhive_token');
  };

  const updateUser = (data) => {
    const u = { ...user, ...data };
    setUser(u);
    localStorage.setItem('jobhive_user', JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
