import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/ReviewHistory.css';

const ReviewHistory = ({ theme }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [page, user]);

  const fetchReviews = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/ai/history/${user.id}?page=${page}`
      );
      setReviews(response.data.reviews);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching review history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  if (!user) {
    return <div className="review-history">Please log in to view history</div>;
  }

  return (
    <div className={`review-history ${theme}`}>
      <div className="history-header">
        <h2>📚 Review History</h2>
        <p>Total Reviews: {total}</p>
      </div>

      {loading ? (
        <div className="loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">No reviews yet. Start by reviewing some code!</div>
      ) : (
        <>
          <div className="history-list">
            {reviews.map((review) => (
              <div key={review.id} className="history-item">
                <div className="history-item-header">
                  <div className="history-meta">
                    <span className="language-badge">{review.language.toUpperCase()}</span>
                    <span className="timestamp">{formatDate(review.timestamp)}</span>
                  </div>
                </div>
                <div className="history-item-code">
                  <pre>
                    <code>{review.code.substring(0, 200)}...</code>
                  </pre>
                </div>
                <div className="history-item-complexity">
                  <span>⏱️ Time: {review.complexity?.time || 'N/A'}</span>
                  <span>💾 Space: {review.complexity?.space || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="page-info">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={reviews.length < 10}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewHistory;
