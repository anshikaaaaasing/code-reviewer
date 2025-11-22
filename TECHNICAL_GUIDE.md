# 🏗️ Architecture & Technical Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER (Port 5173)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │            React Frontend (App.jsx)              │     │
│  ├──────────────────────────────────────────────────┤     │
│  │                                                  │     │
│  │  ┌────────────────────────────────────────┐    │     │
│  │  │          UI Components                 │    │     │
│  │  │  - Code Editor                         │    │     │
│  │  │  - Language Selector                   │    │     │
│  │  │  - Statistics Display                  │    │     │
│  │  │  - Review Panel                        │    │     │
│  │  │  - Theme Toggle                        │    │     │
│  │  └────────────────────────────────────────┘    │     │
│  │                    ▼                           │     │
│  │  ┌────────────────────────────────────────┐    │     │
│  │  │       State Management (Hooks)         │    │     │
│  │  │  - code (string)                       │    │     │
│  │  │  - review (string)                     │    │     │
│  │  │  - loading (boolean)                   │    │     │
│  │  │  - language (string)                   │    │     │
│  │  │  - error (string)                      │    │     │
│  │  │  - theme (string)                      │    │     │
│  │  └────────────────────────────────────────┘    │     │
│  │                    ▼                           │     │
│  │  ┌────────────────────────────────────────┐    │     │
│  │  │      Axios API Client                  │    │     │
│  │  │  POST /ai/get-review                   │    │     │
│  │  └────────────────────────────────────────┘    │     │
│  │                                                 │     │
│  └──────────────────────────────────────────────┐ │     │
│                                                  ▼ ▼     │
│  ┌────────────────────────────────────────────────────┐  │
│  │           Styling (App.css)                       │  │
│  │  - Dark/Light Theme Variables                     │  │
│  │  - Responsive Breakpoints                        │  │
│  │  - Animations & Transitions                      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                HTTP (CORS) │
                    POST    │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXPRESS SERVER (Port 3000)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │           Request Processing                     │     │
│  │  - CORS Middleware                              │     │
│  │  - JSON Parser (50MB limit)                      │     │
│  │  - Logging Middleware                           │     │
│  └──────────────────────────────────────────────────┘     │
│                    ▼                                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │           Router: /ai/get-review                 │     │
│  │  POST request handler                            │     │
│  └──────────────────────────────────────────────────┘     │
│                    ▼                                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │       AI Controller (ai.controller.js)           │     │
│  │  ├─ Input Validation (5 checks)                  │     │
│  │  ├─ Error Handling (try-catch)                   │     │
│  │  ├─ Logging                                      │     │
│  │  └─ Service Call                                 │     │
│  └──────────────────────────────────────────────────┘     │
│                    ▼                                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │       AI Service (ai.service.js)                 │     │
│  │  ├─ Initialize Google Gemini Model               │     │
│  │  ├─ Send prompt with instructions                │     │
│  │  ├─ Handle API response                          │     │
│  │  ├─ Performance metrics                          │     │
│  │  └─ Error handling                               │     │
│  └──────────────────────────────────────────────────┘     │
│                    ▼                                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │       Error Handler Middleware                   │     │
│  │  - 404 handler                                   │     │
│  │  - Error response formatter                      │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
└─────────────────────────────────────────────────────────────┘
                            │
                HTTP        │ (API Response)
            JSON Response   │
                            ▼
                    [Back to Frontend]
```

---

## Component Data Flow

```
┌─────────────────────────────────────────────┐
│        User Types Code in Editor            │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  code state updated (via setCode)           │
│  Statistics calculated in real-time         │
│  Syntax highlighting updated                │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│   User Clicks "✨ Review Code" Button       │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  reviewCode() function executed             │
│  ├─ Validate: code is not empty             │
│  ├─ Set loading = true                      │
│  ├─ Clear previous errors                   │
│  └─ Call API via axios.post()               │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Frontend shows:                            │
│  ├─ Loading spinner                         │
│  ├─ "⏳ Analyzing your code..." text        │
│  └─ Buttons disabled                        │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Backend receives POST request              │
│  /ai/get-review with { code }               │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  AI Controller validates:                   │
│  ✓ code exists                              │
│  ✓ code is string                           │
│  ✓ code not empty                           │
│  ✓ code < 50KB                              │
│  ✓ Log request details                      │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  AI Service processes:                      │
│  ├─ Initialize Google Gemini API            │
│  ├─ Send code + system instructions         │
│  ├─ Wait for API response                   │
│  ├─ Format response                         │
│  └─ Log performance metrics                 │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Google Gemini AI generates review          │
│  AI analyzes code for:                      │
│  - Code quality                             │
│  - Performance issues                       │
│  - Security concerns                        │
│  - Best practices                           │
│  - Suggestions & improvements               │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Backend sends JSON response:               │
│  {                                          │
│    "review": "formatted text with markdown" │
│  }                                          │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Frontend receives response                 │
│  ├─ setReview(response.data)                │
│  ├─ setLoading(false)                       │
│  └─ useEffect triggers (review changed)     │
└─────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Frontend renders review:                   │
│  ├─ Loading spinner disappears              │
│  ├─ Markdown content displays               │
│  ├─ Code blocks highlighted                 │
│  ├─ Copy button enabled                     │
│  └─ Smooth fade-in animation                │
└─────────────────────────────────────────────┘
```

---

## File Structure & Responsibilities

```
code-review/
│
├── Frontend/ ......................... React Application
│   │
│   ├── src/
│   │   ├── App.jsx .................. Main React Component
│   │   │   ├── State Management
│   │   │   │   ├── code (user input)
│   │   │   │   ├── review (AI output)
│   │   │   │   ├── loading (status)
│   │   │   │   ├── language (selected)
│   │   │   │   ├── error (messages)
│   │   │   │   └── theme (dark/light)
│   │   │   │
│   │   │   ├── Event Handlers
│   │   │   │   ├── reviewCode()
│   │   │   │   ├── copyToClipboard()
│   │   │   │   └── theme toggle
│   │   │   │
│   │   │   ├── JSX Structure
│   │   │   │   ├── Header
│   │   │   │   ├── Main Layout
│   │   │   │   ├── Left Panel (Editor)
│   │   │   │   ├── Right Panel (Review)
│   │   │   │   └── Footer
│   │   │   │
│   │   │   └── API Integration
│   │   │       └── axios.post() to backend
│   │   │
│   │   ├── App.css .................. Styling
│   │   │   ├── Global Styles
│   │   │   ├── Header Styles
│   │   │   ├── Editor Styles
│   │   │   ├── Button Styles
│   │   │   ├── Theme Variables
│   │   │   ├── Animations
│   │   │   └── Responsive Breakpoints
│   │   │
│   │   ├── main.jsx ................. Entry Point
│   │   │   └── React Router setup
│   │   │
│   │   └── assets/ .................. Static Files
│   │
│   ├── index.html ................... HTML Template
│   │   ├── Meta tags
│   │   ├── Root div
│   │   └── Script loader
│   │
│   ├── vite.config.js ............... Build Configuration
│   ├── eslint.config.js ............. Linting Rules
│   ├── package.json ................. Dependencies
│   └── package-lock.json ............ Lock File
│
├── BackEnd/ ......................... Node.js Server
│   │
│   ├── server.js .................... Server Entry Point
│   │   ├── Require dotenv
│   │   ├── Import app
│   │   ├── Set port (3000)
│   │   ├── Start listening
│   │   └── Console logging
│   │
│   ├── src/
│   │   │
│   │   ├── app.js ................... Express App Setup
│   │   │   ├── CORS Middleware
│   │   │   ├── JSON Parser (50MB limit)
│   │   │   ├── Logging Middleware
│   │   │   ├── Health Check (GET /)
│   │   │   ├── AI Routes
│   │   │   ├── 404 Handler
│   │   │   └── Error Handler
│   │   │
│   │   ├── routes/
│   │   │   └── ai.routes.js ........ Route Definitions
│   │   │       ├── POST /ai/get-review
│   │   │       └── Controller binding
│   │   │
│   │   ├── controllers/
│   │   │   └── ai.controller.js .... Request Handler
│   │   │       ├── Input Validation
│   │   │       │   ├── Check exists
│   │   │       │   ├── Type check
│   │   │       │   ├── Empty check
│   │   │       │   ├── Size check
│   │   │       │   └── Error responses
│   │   │       │
│   │   │       ├── Service Call
│   │   │       ├── Response Formatting
│   │   │       ├── Error Handling
│   │   │       └── Logging
│   │   │
│   │   └── services/
│   │       └── ai.service.js ....... AI Integration
│   │           ├── Google Gemini Initialization
│   │           ├── System Instructions
│   │           ├── generateContent()
│   │           │   ├── API Call
│   │           │   ├── Response Parsing
│   │           │   ├── Performance Metrics
│   │           │   └── Error Handling
│   │           │
│   │           ├── Error Handling
│   │           │   ├── API key errors
│   │           │   ├── Rate limit errors
│   │           │   └── Network errors
│   │           │
│   │           └── Logging
│   │
│   ├── .env ......................... Environment Variables
│   │   └── GOOGLE_GEMINI_KEY=your_key
│   │
│   ├── package.json ................. Dependencies
│   └── package-lock.json ............ Lock File
│
├── README.md ........................ Full Documentation
├── QUICKSTART.md .................... Quick Setup Guide
├── IMPROVEMENTS.md .................. Enhancement Details
├── BEFORE_AFTER.md .................. Comparison Guide
├── FUTURE_ENHANCEMENTS.md ........... Development Roadmap
├── SUMMARY.md ....................... Transformation Summary
├── TECHNICAL_GUIDE.md ............... This File
└── .gitignore ....................... Git Configuration
```

---

## Technology Stack

### Frontend
```
┌─────────────────────────────────┐
│      Frontend Stack             │
├─────────────────────────────────┤
│ Framework:  React 19            │
│ Build Tool: Vite 6.1            │
│ HTTP:       Axios 1.7.9         │
│ Markdown:   React Markdown 9.0  │
│ Highlighting:                   │
│   - PrismJS 1.29                │
│   - Highlight.js 11.11          │
│ Code Editor:                    │
│   - react-simple-code-editor    │
│ Runtime:    Node.js             │
│ Package Mgr: npm                │
└─────────────────────────────────┘
```

### Backend
```
┌─────────────────────────────────┐
│      Backend Stack              │
├─────────────────────────────────┤
│ Runtime:    Node.js 14+         │
│ Framework:  Express 4.21.2      │
│ AI API:     Google Gemini 0.21  │
│ CORS:       cors 2.8.5          │
│ Env Config: dotenv 16.4.7       │
│ Port:       3000                │
│ Package Mgr: npm                │
└─────────────────────────────────┘
```

---

## API Endpoints

### POST /ai/get-review

**Request:**
```json
{
  "code": "function sum() { return 1 + 1; }"
}
```

**Response (Success):**
```json
{
  "review": "# Overall Assessment\n✅ Good code...",
  "status": "success"
}
```

**Response (Validation Error):**
```json
{
  "error": "Code is required",
  "status": "error"
}
```

**Response (Server Error):**
```json
{
  "error": "Failed to generate review",
  "status": "error"
}
```

---

## Request/Response Flow

```
1. Frontend Component
   ↓
2. User Input (code, language)
   ↓
3. Click Review Button
   ↓
4. API Call: axios.post('/ai/get-review', { code })
   ↓
5. Backend Receives Request
   ↓
6. Validation Layer
   ├─ Check code exists
   ├─ Check type
   ├─ Check not empty
   ├─ Check size
   └─ Log details
   ↓
7. Controller Processing
   ├─ Handle validation
   ├─ Call service
   └─ Format response
   ↓
8. AI Service
   ├─ Initialize Gemini API
   ├─ Send code + instructions
   ├─ Get AI response
   └─ Log metrics
   ↓
9. Error Handling (if needed)
   ├─ Catch errors
   ├─ Format error
   └─ Send error response
   ↓
10. Response Sent to Frontend
    ↓
11. Frontend Updates State
    ├─ setReview(data)
    ├─ setLoading(false)
    └─ Clear errors
    ↓
12. Re-render Component
    ├─ Hide spinner
    ├─ Show review
    ├─ Enable buttons
    └─ Highlight syntax
    ↓
13. User Sees Results
```

---

## State Management (React Hooks)

```
App Component State:

┌──────────────────────────────────┐
│ useState(code)                   │
├──────────────────────────────────┤
│ Current code in editor           │
│ Type: string                     │
│ Initial: default function        │
└──────────────────────────────────┘
        │
        ├──→ setCode(newCode)
        └──→ Updated on every keystroke

┌──────────────────────────────────┐
│ useState(review)                 │
├──────────────────────────────────┤
│ AI review result                 │
│ Type: string (Markdown)          │
│ Initial: empty string            │
└──────────────────────────────────┘
        │
        ├──→ setReview(data)
        └──→ Updated after API response

┌──────────────────────────────────┐
│ useState(loading)                │
├──────────────────────────────────┤
│ Loading state during API call    │
│ Type: boolean                    │
│ Initial: false                   │
└──────────────────────────────────┘
        │
        ├──→ setLoading(true) before API
        ├──→ setLoading(false) after API
        └──→ Shows spinner when true

┌──────────────────────────────────┐
│ useState(language)               │
├──────────────────────────────────┤
│ Selected programming language    │
│ Type: string                     │
│ Initial: 'javascript'            │
└──────────────────────────────────┘
        │
        ├──→ setLanguage(lang)
        └──→ Updates syntax highlighting

┌──────────────────────────────────┐
│ useState(error)                  │
├──────────────────────────────────┤
│ Error message display            │
│ Type: string                     │
│ Initial: empty string            │
└──────────────────────────────────┘
        │
        ├──→ setError(msg)
        └──→ Shows error UI

┌──────────────────────────────────┐
│ useState(theme)                  │
├──────────────────────────────────┤
│ Current theme setting            │
│ Type: 'dark' or 'light'          │
│ Initial: 'dark'                  │
└──────────────────────────────────┘
        │
        ├──→ setTheme(newTheme)
        └──→ Updates CSS classes
```

---

## Middleware Pipeline

```
Request from Frontend
        ↓
┌─────────────────────────────────┐
│ 1. CORS Middleware              │
│    - Check origin               │
│    - Allow cross-domain         │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ 2. JSON Parser                  │
│    - Parse request body         │
│    - Limit: 50MB                │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ 3. Logging Middleware           │
│    - Log request details        │
│    - Track timing               │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ 4. Router (POST /ai/get-review) │
│    - Match route                │
│    - Call handler               │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ 5. Controller                   │
│    - Validate input             │
│    - Call service               │
│    - Format response            │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ 6. Service                      │
│    - Call Google API            │
│    - Process response           │
│    - Handle errors              │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ 7. Response Sent                │
│    - JSON format                │
│    - HTTP status code           │
│    - Headers                    │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ 8. Error Handler (if error)     │
│    - Catch exceptions           │
│    - Format error               │
│    - Send error response        │
└─────────────────────────────────┘
        ↓
Response to Frontend
```

---

## Key Design Patterns Used

### 1. **Component-Based Architecture**
- React functional components
- Hooks for state management
- Separation of concerns

### 2. **MVC Pattern (Backend)**
- Models: Data structures
- Views: API responses
- Controllers: Request handling
- Services: Business logic

### 3. **Error Handling Pattern**
- Try-catch blocks
- Graceful error handling
- User-friendly messages

### 4. **Middleware Pattern**
- Express middleware pipeline
- Logging middleware
- Error middleware

### 5. **State Management Pattern**
- React hooks (useState)
- Single source of truth
- Unidirectional data flow

---

## Performance Considerations

```
Frontend Optimizations:
├─ React.memo for components
├─ useCallback for handlers
├─ useEffect dependencies
├─ Lazy loading (future)
└─ Code splitting (future)

Backend Optimizations:
├─ Request size limit
├─ Connection pooling
├─ Caching (future)
├─ Database indexing (future)
└─ Load balancing (future)

Network Optimizations:
├─ GZIP compression (future)
├─ CDN for static assets (future)
├─ Request coalescing (future)
└─ HTTP/2 push (future)
```

---

This technical guide provides a complete overview of the system architecture, data flow, and design patterns used in the AI Code Reviewer application.

For more information, see the other documentation files:
- README.md - General overview
- QUICKSTART.md - Getting started
- IMPROVEMENTS.md - Feature list
- FUTURE_ENHANCEMENTS.md - Development roadmap
