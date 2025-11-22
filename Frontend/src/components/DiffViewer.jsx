import React, { useState } from 'react';
import '../styles/DiffViewer.css';

const DiffViewer = ({ originalCode, suggestedCode, language }) => {
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'unified'

  // Split code into lines for comparison
  const originalLines = originalCode ? originalCode.split('\n') : [];
  const suggestedLines = suggestedCode ? suggestedCode.split('\n') : [];

  // Calculate diff (simple line-by-line comparison)
  const getDiffStatus = (lineOrig, lineSugg) => {
    if (lineOrig === lineSugg) return 'same';
    if (!lineOrig) return 'added';
    if (!lineSugg) return 'removed';
    return 'modified';
  };

  return (
    <div className="diff-viewer-container">
      <div className="diff-header">
        <h3>Code Comparison</h3>
        <div className="diff-controls">
          <button
            className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split View
          </button>
          <button
            className={`view-btn ${viewMode === 'unified' ? 'active' : ''}`}
            onClick={() => setViewMode('unified')}
          >
            Unified View
          </button>
        </div>
      </div>

      {viewMode === 'split' ? (
        <div className="diff-split-view">
          <div className="diff-panel original">
            <div className="diff-panel-header">Original Code</div>
            <div className="diff-content">
              {originalLines.map((line, idx) => (
                <div key={`orig-${idx}`} className="diff-line original-line">
                  <span className="line-number">{idx + 1}</span>
                  <span className="line-content">{line || '\n'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="diff-divider"></div>

          <div className="diff-panel suggested">
            <div className="diff-panel-header">Suggested Code</div>
            <div className="diff-content">
              {suggestedLines.map((line, idx) => (
                <div key={`sugg-${idx}`} className="diff-line suggested-line">
                  <span className="line-number">{idx + 1}</span>
                  <span className="line-content">{line || '\n'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="diff-unified-view">
          <div className="diff-content unified">
            {Math.max(originalLines.length, suggestedLines.length) > 0 ? (
              Array.from({
                length: Math.max(originalLines.length, suggestedLines.length)
              }).map((_, idx) => {
                const origLine = originalLines[idx] || '';
                const suggLine = suggestedLines[idx] || '';
                const status = getDiffStatus(origLine, suggLine);

                return (
                  <div key={`unified-${idx}`} className={`unified-diff-line ${status}`}>
                    <div className="diff-line original-line">
                      <span className="line-number">{idx + 1}</span>
                      <span className="status-indicator">-</span>
                      <span className="line-content">{origLine || '\n'}</span>
                    </div>
                    <div className="diff-line suggested-line">
                      <span className="line-number">{idx + 1}</span>
                      <span className="status-indicator">+</span>
                      <span className="line-content">{suggLine || '\n'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-diff">No code to compare</div>
            )}
          </div>
        </div>
      )}

      <div className="diff-legend">
        <div className="legend-item">
          <span className="legend-color original"></span>
          <span>Original</span>
        </div>
        <div className="legend-item">
          <span className="legend-color suggested"></span>
          <span>Suggested</span>
        </div>
        <div className="legend-item">
          <span className="legend-color added"></span>
          <span>Added</span>
        </div>
        <div className="legend-item">
          <span className="legend-color removed"></span>
          <span>Removed</span>
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;
