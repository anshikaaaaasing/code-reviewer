import React from 'react';
import '../styles/Branding.css';

const BrandingPage = ({ theme, toggleTheme }) => {
  const downloadLogo = (format) => {
    const canvas = document.getElementById(`logo-canvas-${format}`);
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL(`image/${format}`);
      link.download = `code-reviewer-logo.${format}`;
      link.click();
    }
  };

  React.useEffect(() => {
    // Draw SVG logos on canvas for download
    const drawLogoSquare = (canvasId) => {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const size = canvas.width;
      
      // Background
      ctx.fillStyle = theme === 'dark' ? '#1a1a2e' : '#f5f5f5';
      ctx.fillRect(0, 0, size, size);
      
      // Outer circle
      ctx.strokeStyle = theme === 'dark' ? '#5588dd' : '#8B6F47';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner design - code brackets
      ctx.fillStyle = theme === 'dark' ? '#5588dd' : '#8B6F47';
      ctx.font = 'bold 80px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('</>', size / 2, size / 2);
    };

    drawLogoSquare('logo-canvas-png');
    drawLogoSquare('logo-canvas-jpg');
  }, [theme]);

  return (
    <div className={`app ${theme}`}>
      <div className="branding-page">
        <div className="branding-header">
          <h1>💼 Code Reviewer - Brand Guidelines</h1>
          <p>Professional branding and visual identity system</p>
        </div>

        <div className="branding-content">
          {/* Logo Section */}
          <section className="branding-section">
            <h2>Logo & Identity</h2>
            <div className="logo-showcase">
              <div className="logo-card">
                <div className="logo-display">
                  <div className="logo-svg">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="95" fill="none" 
                        stroke={theme === 'dark' ? '#5588dd' : '#8B6F47'} 
                        strokeWidth="6"/>
                      <text x="100" y="120" fontSize="80" fontWeight="bold" 
                        textAnchor="middle" 
                        fill={theme === 'dark' ? '#5588dd' : '#8B6F47'}>
                        {'</>'}
                      </text>
                    </svg>
                  </div>
                  <h3>Primary Logo</h3>
                  <p>Main logo mark with code brackets</p>
                </div>
              </div>

              <div className="logo-card">
                <div className="logo-display horizontal">
                  <svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="50" fill="none" 
                      stroke={theme === 'dark' ? '#5588dd' : '#8B6F47'} 
                      strokeWidth="4"/>
                    <text x="60" y="75" fontSize="50" fontWeight="bold" 
                      textAnchor="middle" 
                      fill={theme === 'dark' ? '#5588dd' : '#8B6F47'}>
                      {'</>'}
                    </text>
                    <text x="150" y="70" fontSize="36" fontWeight="bold" 
                      fill={theme === 'dark' ? '#5588dd' : '#8B6F47'}>
                      Code Reviewer
                    </text>
                  </svg>
                  <h3>Horizontal Logo</h3>
                  <p>Logo with text lockup</p>
                </div>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="branding-section">
            <h2>Color Palette</h2>
            <div className="color-grid">
              <div className="color-swatch">
                <div className="color-box" style={{ backgroundColor: '#8B6F47' }}></div>
                <div className="color-info">
                  <p className="color-name">Primary Brown</p>
                  <p className="color-code">#8B6F47</p>
                  <p className="color-usage">Light mode primary</p>
                </div>
              </div>
              <div className="color-swatch">
                <div className="color-box" style={{ backgroundColor: '#5588dd' }}></div>
                <div className="color-info">
                  <p className="color-name">Primary Blue</p>
                  <p className="color-code">#5588dd</p>
                  <p className="color-usage">Dark mode primary</p>
                </div>
              </div>
              <div className="color-swatch">
                <div className="color-box" style={{ backgroundColor: '#f5f5f5' }}></div>
                <div className="color-info">
                  <p className="color-name">Light Background</p>
                  <p className="color-code">#f5f5f5</p>
                  <p className="color-usage">Light mode background</p>
                </div>
              </div>
              <div className="color-swatch">
                <div className="color-box" style={{ backgroundColor: '#1a1a2e' }}></div>
                <div className="color-info">
                  <p className="color-name">Dark Background</p>
                  <p className="color-code">#1a1a2e</p>
                  <p className="color-usage">Dark mode background</p>
                </div>
              </div>
              <div className="color-swatch">
                <div className="color-box" style={{ backgroundColor: '#28a745' }}></div>
                <div className="color-info">
                  <p className="color-name">Success Green</p>
                  <p className="color-code">#28a745</p>
                  <p className="color-usage">Success states</p>
                </div>
              </div>
              <div className="color-swatch">
                <div className="color-box" style={{ backgroundColor: '#dc3545' }}></div>
                <div className="color-info">
                  <p className="color-name">Error Red</p>
                  <p className="color-code">#dc3545</p>
                  <p className="color-usage">Error states</p>
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="branding-section">
            <h2>Typography</h2>
            <div className="typography-grid">
              <div className="typography-sample">
                <h3>Heading 1</h3>
                <p className="font-info">32px • Bold • Primary Color</p>
              </div>
              <div className="typography-sample">
                <h4>Heading 2</h4>
                <p className="font-info">24px • Bold • Primary Color</p>
              </div>
              <div className="typography-sample">
                <p>Body Text</p>
                <p className="font-info">14px • Regular • Text Primary</p>
              </div>
              <div className="typography-sample">
                <p className="small">Small Text</p>
                <p className="font-info">12px • Regular • Text Secondary</p>
              </div>
            </div>
          </section>

          {/* Logo Downloads */}
          <section className="branding-section">
            <h2>Download Logo</h2>
            <div className="download-grid">
              <div className="download-item">
                <canvas id="logo-canvas-png" width="200" height="200" style={{ maxWidth: '100%' }}></canvas>
                <button onClick={() => downloadLogo('png')} className="download-btn">
                  📥 Download PNG
                </button>
              </div>
              <div className="download-item">
                <canvas id="logo-canvas-jpg" width="200" height="200" style={{ maxWidth: '100%' }}></canvas>
                <button onClick={() => downloadLogo('jpg')} className="download-btn">
                  📥 Download JPG
                </button>
              </div>
            </div>
          </section>

          {/* Brand Voice */}
          <section className="branding-section">
            <h2>Brand Voice & Tone</h2>
            <div className="brand-voice">
              <div className="voice-card">
                <h4>Professional</h4>
                <p>Trustworthy and authoritative in code review expertise</p>
              </div>
              <div className="voice-card">
                <h4>Friendly</h4>
                <p>Approachable and helpful, making code review accessible</p>
              </div>
              <div className="voice-card">
                <h4>Clear</h4>
                <p>Direct and concise communication, avoiding jargon where possible</p>
              </div>
              <div className="voice-card">
                <h4>Innovative</h4>
                <p>Cutting-edge AI-powered solutions for modern development</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;
