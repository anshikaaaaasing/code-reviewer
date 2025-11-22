import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import ComplexityAnalysis from './ComplexityAnalysis'
import DiffViewer from './DiffViewer'
import '../App.css'

function CodeReviewApp({ theme }) {
  const { user } = useAuth()
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('javascript')
  const [detectedLanguage, setDetectedLanguage] = useState('')
  const [error, setError] = useState('')
  const [complexity, setComplexity] = useState(null)
  const [suggestedCode, setSuggestedCode] = useState('')

  useEffect(() => {
    prism.highlightAll()
  }, [review])

  async function reviewCode() {
    if (!code.trim()) {
      setError('Please enter some code to review')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { 
        code,
        language: 'auto',
        userId: user?.id
      })
      setReview(response.data.review)
      setComplexity(response.data.complexity)
      setDetectedLanguage(response.data.language)
      setSuggestedCode(response.data.suggestedCode || '')
    } catch (err) {
      setError(err.response?.data?.error || 'Error generating review. Please try again.')
      setReview('')
      setComplexity(null)
      setDetectedLanguage('')
      setSuggestedCode('')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(review)
    alert('Review copied to clipboard!')
  }

  const codeStats = {
    lines: code.split('\n').length,
    characters: code.length,
    words: code.split(/\s+/).length
  }

  return (
    <main>
      <div className="left">
        <div className="editor-header">
          <h2>Code Input</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Language will be auto-detected</p>
        </div>

        <div className="code-stats">
          <span>📝 Lines: {codeStats.lines}</span>
          <span>📊 Characters: {codeStats.characters}</span>
          <span>📄 Words: {codeStats.words}</span>
        </div>

        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => prism.highlight(code, prism.languages[language] || prism.languages.javascript, language)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              border: "none",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
              backgroundColor: theme === 'dark' ? '#0c0c0c' : '#f5f5f5'
            }}
          />
        </div>

        <div className="button-group">
          <button
            onClick={reviewCode}
            className={`review-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? '⏳ Reviewing...' : '✨ Review Code'}
          </button>
          <button
            onClick={() => setCode('')}
            className="clear-btn"
          >
            🗑️ Clear
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className={`right ${theme}`}>
        <div className="review-header">
          <h2>📋 Review Results</h2>
          <div className="review-header-actions">
            {review && (
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copy Review
              </button>
            )}
            {review && (
              <button onClick={() => {
                setReview('')
                setComplexity(null)
                setSuggestedCode('')
              }} className="clear-btn">
                🗑️ Clear
              </button>
            )}
          </div>
        </div>
        
        {!review && !loading && (
          <div className="placeholder">
            <p>Your code review will appear here...</p>
          </div>
        )}
        
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Analyzing your code...</p>
          </div>
        )}
        
        {review && (
          <div className="review-content">
            {detectedLanguage && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
                <p style={{ margin: '0.5rem 0', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  📝 <strong>Language:</strong> {detectedLanguage}
                </p>
              </div>
            )}
            {complexity && <ComplexityAnalysis complexity={complexity} />}
            {suggestedCode && (
              <DiffViewer 
                originalCode={code} 
                suggestedCode={suggestedCode}
                language={detectedLanguage || language}
              />
            )}
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          </div>
        )}
      </div>
    </main>
  )
}

export default CodeReviewApp
