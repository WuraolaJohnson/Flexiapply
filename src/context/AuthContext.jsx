import { createContext, useContext, useState, useEffect } from 'react';
import mockApi from '../api/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await mockApi.get(`/users?email=${encodeURIComponent(email)}`);
      
      let loggedInUser = null;
      if (response.data && response.data.length > 0) {
        loggedInUser = response.data.find(u => u.email === email && u.password === password);
      }
      
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setLoading(false);
        return { success: true, role: loggedInUser.role };
      } else {
        throw new Error("Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      setLoading(false);
      throw error.message || 'Login failed';
    }
  };

  const signupAdmin = async (name, email, password) => {
    setLoading(true);
    try {
      const existing = await mockApi.get(`/users?email=${encodeURIComponent(email)}`);
      if (existing.data && existing.data.length > 0) {
        throw new Error("An account with this email already exists.");
      }
      
      const newUser = {
        email,
        password,
        role: 'ADMIN',
        name
      };
      
      const res = await mockApi.post('/users', newUser);
      const createdUser = res.data;
      
      setUser(createdUser);
      localStorage.setItem('user', JSON.stringify(createdUser));
      setLoading(false);
      return { success: true, role: createdUser.role };
    } catch (error) {
      setLoading(false);
      throw error.message || 'Signup failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signupAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
