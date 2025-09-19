/**
 * LIT ISLE - Express Application Configuration
 * 
 * This file configures the Express server for the LIT ISLE API.
 * It sets up middleware, routes, and error handling for the backend.
 * 
 * Key Features:
 * - CORS configuration for cross-origin requests
 * - JSON and URL-encoded body parsing
 * - Static file serving for uploads
 * - Comprehensive API routing
 * - Error handling middleware
 * 
 * @author LIT ISLE Development Team
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ===== ROUTE IMPORTS =====
import userRouter from './routes/userRoute.js';
import bookRouter from './routes/bookRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import shelfRouter from './routes/shelfRoute.js';
import authorRouter from './routes/authorRoute.js';
import readingRouter from './routes/readingRoute.js';
import profileRouter from './routes/profileRoute.js';
import activityRouter from './routes/activityRoute.js';

// ===== MIDDLEWARE IMPORTS =====
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// ===== ENVIRONMENT CONFIGURATION =====
// Load environment variables from .env file
dotenv.config();

// ===== EXPRESS APPLICATION SETUP =====
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARE CONFIGURATION =====

/**
 * CORS Configuration
 * 
 * Enables cross-origin resource sharing for the frontend application.
 * Allows credentials to be sent with requests for authentication.
 */
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

/**
 * Body Parsing Middleware
 * 
 * Parses incoming request bodies in JSON and URL-encoded formats.
 * Set to 10MB limit to handle large file uploads.
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== STATIC FILE SERVING =====
/**
 * Static File Middleware
 * 
 * Serves uploaded files (images, documents) from the uploads directory.
 * Allows direct access to user-uploaded content.
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API ROUTES CONFIGURATION =====
/**
 * API Route Handlers
 * 
 * Mounts all API route handlers with their respective prefixes.
 * Each route group handles specific functionality:
 * - /api/users: User authentication and management
 * - /api/user: User profile operations
 * - /api/activity: User activity tracking
 * - /api/books: Book management and operations
 * - /api/reviews: Book reviews and ratings
 * - /api/shelf: User bookshelf management
 * - /api/authors: Author information and management
 * - /api/reading: Reading progress tracking
 */
app.use('/api/users', userRouter);
app.use('/api/user', profileRouter);
app.use('/api/activity', activityRouter);
app.use('/api/books', bookRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/shelf', shelfRouter);
app.use('/api/authors', authorRouter);
app.use('/api/reading', readingRouter);

// ===== API ENDPOINTS =====

/**
 * Health Check Endpoint
 * 
 * Provides basic server status and version information.
 * Used for monitoring and health checks.
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'LIT ISLE Digital Library API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

/**
 * API Documentation Endpoint
 * 
 * Provides information about available API endpoints and documentation.
 * Helps developers understand the API structure.
 */
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'LIT ISLE Digital Library API',
        endpoints: {
            users: '/api/users',
            books: '/api/books',
            reviews: '/api/reviews',
            shelf: '/api/shelf',
            authors: '/api/authors',
            reading: '/api/reading'
        },
        documentation: 'https://docs.litisle.com/api'
    });
});

// ===== ERROR HANDLING MIDDLEWARE =====
/**
 * Error Handling Middleware
 * 
 * These middleware functions must be placed last to catch all errors.
 * - notFound: Handles 404 errors for undefined routes
 * - errorHandler: Handles all other errors and formats responses
 */
app.use(notFound);
app.use(errorHandler);

export default app;