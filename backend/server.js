const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration for Vercel
app.use(cors({
    origin: [
        'https://your-app-name.vercel.app',
        'http://localhost:3000',
        'http://localhost:8000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB connection with fallback for Vercel
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-app';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tracks', require('./routes/tracks'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export for Vercel serverless
module.exports = app;
