const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const authRoutes = require('./routes/auth.routes')
const cors = require('cors')

const app = express()

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://yourdomain.com' 
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
})

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'AI Code Reviewer API',
        version: '1.0.0',
        status: 'active'
    })
})

// API Routes
app.use('/auth', authRoutes)
app.use('/ai', aiRoutes)

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path 
    })
})

// Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error',
        status: 'error'
    })
})

module.exports = app