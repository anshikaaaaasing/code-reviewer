import React from 'react';
import '../styles/ComplexityAnalysis.css';

const ComplexityAnalysis = ({ complexity }) => {
  if (!complexity) return null;

  const getComplexityColor = (value) => {
    if (value.includes('1')) return '#10b981'; // O(1) - Green
    if (value.includes('log')) return '#3b82f6'; // O(log n) - Blue
    if (value.includes('n²') || value.includes('n2')) return '#f59e0b'; // O(n²) - Amber
    if (value.includes('2^n')) return '#ef4444'; // O(2^n) - Red
    return '#8b5cf6'; // O(n) - Purple
  };

  return (
    <div className="complexity-analysis">
      <h3>📊 Complexity Metrics</h3>
      <div className="complexity-grid">
        <div className="complexity-item">
          <div className="complexity-label">Time Complexity</div>
          <div
            className="complexity-value"
            style={{ color: getComplexityColor(complexity.time) }}
          >
            {complexity.time}
          </div>
        </div>
        <div className="complexity-item">
          <div className="complexity-label">Space Complexity</div>
          <div
            className="complexity-value"
            style={{ color: getComplexityColor(complexity.space) }}
          >
            {complexity.space}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityAnalysis;
