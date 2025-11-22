import React from 'react';
import '../styles/QualityBadge.css';

const QualityBadge = ({ score, grade }) => {
  const getColor = () => {
    if (grade === 'A') return '#10b981'; // Green
    if (grade === 'B') return '#3b82f6'; // Blue
    if (grade === 'C') return '#f59e0b'; // Amber
    if (grade === 'D') return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="quality-badge" style={{ borderColor: getColor() }}>
      <div className="quality-score-value" style={{ color: getColor() }}>
        {grade}
      </div>
      <div className="quality-score-details">
        <div className="quality-score-number">{score}</div>
        <div className="quality-score-label">Quality</div>
      </div>
      <div className="quality-score-bar">
        <div
          className="quality-score-fill"
          style={{ width: `${score}%`, backgroundColor: getColor() }}
        />
      </div>
    </div>
  );
};

export default QualityBadge;
