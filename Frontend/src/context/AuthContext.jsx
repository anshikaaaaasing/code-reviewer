import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/auth';

  // Verify token on mount
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setError('Token expired or invalid');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, confirmPassword, name) => {
    try {
      setLoading(true);
      console.log('Signup attempt:', { email, name });
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        confirmPassword,
        name
      });

      console.log('Signup success:', response.data);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || err.message || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
