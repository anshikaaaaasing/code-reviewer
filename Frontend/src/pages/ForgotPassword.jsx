import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const ForgotPassword = ({ theme, toggleTheme }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/verify-email', { email });
      console.log('Email verification response:', response.data);
      
      if (response.data.exists) {
        setStep(2);
        setSuccess('Email found! Answer the security question.');
      } else {
        setError('Email not found.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error checking email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityAnswer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/verify-security', { email, answer });
      console.log('Security verification response:', response.data);
      
      if (response.data.verified) {
        setStep(3);
        setSuccess('Verified! Now set your new password.');
      } else {
        setError('Wrong answer.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error verifying answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/reset-password', { email, newPassword });
      console.log('Password reset response:', response.data);
      
      setSuccess('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Error:', err);
      setError('Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${theme}`}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header-with-toggle">
            <div className="auth-header">
              <h1>💻 Code Reviewer</h1>
              <p>Reset Password</p>
            </div>
            <button className="theme-toggle-form" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Checking...' : 'Next'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSecurityAnswer} className="auth-form">
              <div className="form-group">
                <label>Security Question</label>
                <p className="security-question-text">What is your favorite color?</p>
              </div>
              <div className="form-group">
                <label htmlFor="answer">Answer</label>
                <input
                  id="answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your answer"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Verifying...' : 'Next'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>
              <Link to="/login" className="auth-link">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
