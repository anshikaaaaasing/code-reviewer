import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>💻 Code Reviewer</h1>
        </div>

        <div className="nav-menu">
          <div className="nav-left">
          </div>

          <div className="nav-right">
            <button className="theme-toggle-nav" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            {user && (
              <>
                <div className="nav-user">
                  <span className="user-name">{user?.name || user?.email}</span>
                </div>
                <button className="nav-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
