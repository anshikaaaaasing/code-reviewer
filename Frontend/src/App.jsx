import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CodeReviewApp from './components/CodeReviewApp';
import './App.css';

function AppRoutes({ theme, toggleTheme }) {
  const { user, loading } = useAuth();

  return (
    <>
      {user && !loading && <Navigation theme={theme} toggleTheme={toggleTheme} />}
      <div className="routes-wrapper">
        <Routes>
          <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/signup" element={<Signup theme={theme} toggleTheme={toggleTheme} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="main-container">
                  <CodeReviewApp theme={theme} />
                  <footer className="footer">
                    <p>Advanced Code Review Tool</p>
                  </footer>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`app-wrapper ${theme}`}>
      <AuthProvider>
        <Router>
          <AppRoutes theme={theme} toggleTheme={toggleTheme} />
        </Router>
      </AuthProvider>
    </div>
  );
}
