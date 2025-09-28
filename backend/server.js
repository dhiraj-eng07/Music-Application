const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enhanced CORS for production
app.use(cors({
    origin: [
        'https://your-app-name.vercel.app',
        'http://localhost:3000',
        'http://localhost:8000',
        'http://localhost:5000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tracks', require('./routes/tracks'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Test database connection endpoint
app.get('/api/db-status', async (req, res) => {
    try {
        // Try to ping the database
        await mongoose.connection.db.admin().ping();
        res.json({ 
            status: 'Connected', 
            database: mongoose.connection.db.databaseName,
            collections: await mongoose.connection.db.listCollections().toArray()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'Disconnected', 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 DB Status: http://localhost:${PORT}/api/db-status`);
});
