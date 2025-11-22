import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CodeReviewApp from './components/CodeReviewApp';
import ReviewHistory from './pages/ReviewHistory';
import UserProfile from './pages/UserProfile';
import Branding from './pages/Branding';
import './App.css';

function AppRoutes() {
  const { user, logout } = useAuth();
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
    <Router>
      <Routes>
        <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/signup" element={<Signup theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/forgot-password" element={<ForgotPassword theme={theme} toggleTheme={toggleTheme} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigation theme={theme} toggleTheme={toggleTheme} />
              <div className={`app ${theme}`}>
                <header className="header">
                  <div className="header-content">
                    <h1>💻 Code Reviewer</h1>
                    <p>Intelligent code analysis and detailed review suggestions</p>
                  </div>
                </header>
                <CodeReviewApp theme={theme} />
                <footer className="footer">
                  <p>Advanced Code Review Tool</p>
                </footer>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Navigation theme={theme} toggleTheme={toggleTheme} />
              <div className={`app ${theme}`}>
                <header className="header">
                  <div className="header-content">
                    <h1>💻 Code Reviewer</h1>
                    <p>Intelligent code analysis and detailed review suggestions</p>
                  </div>
                </header>
                <ReviewHistory theme={theme} />
                <footer className="footer">
                  <p>Advanced Code Review Tool</p>
                </footer>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navigation theme={theme} toggleTheme={toggleTheme} />
              <div className={`app ${theme}`}>
                <header className="header">
                  <div className="header-content">
                    <h1>💻 Code Reviewer</h1>
                    <p>Intelligent code analysis and detailed review suggestions</p>
                  </div>
                </header>
                <UserProfile theme={theme} />
                <footer className="footer">
                  <p>Advanced Code Review Tool</p>
                </footer>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
