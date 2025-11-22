import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/UserProfile.css';

const UserProfile = ({ theme }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/ai/history/${user.id}?page=1`
      );
      const allReviews = response.data.reviews;
      setReviews(allReviews);
      setStats({
        totalReviews: response.data.total
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="user-profile">Please log in to view your profile</div>;
  }

  return (
    <div className={`user-profile ${theme}`}>
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.name || 'User'}</h1>
          <p>{user.email}</p>
          <p className="member-since">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalReviews}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {Math.round((stats.totalReviews * 15) / 60)} min
          </div>
          <div className="stat-label">Est. Time Saved</div>
        </div>
      </div>

      <div className="profile-section">
        <h2>🏆 Recent Reviews</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="no-data">No reviews yet. Start reviewing code to build your profile!</div>
        ) : (
          <div className="recent-reviews">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-card-header">
                  <span className="language">{review.language.toUpperCase()}</span>
                  <span className="date">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-card-code">
                  {review.code.substring(0, 150)}...
                </div>
                <div className="review-card-complexity">
                  <span>⏱️ Time: {review.complexity?.time || 'N/A'}</span>
                  <span>💾 Space: {review.complexity?.space || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>⚙️ Preferences</h2>
        <div className="preferences">
          <div className="preference-item">
            <span>Theme</span>
            <span className="pref-value">{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
          </div>
          <div className="preference-item">
            <span>Notifications</span>
            <span className="pref-value">Enabled</span>
          </div>
          <div className="preference-item">
            <span>Auto-save</span>
            <span className="pref-value">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
