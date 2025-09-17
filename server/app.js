import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import userRouter from './routes/userRoute.js';
import bookRouter from './routes/bookRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import shelfRouter from './routes/shelfRoute.js';
import authorRouter from './routes/authorRoute.js';
import readingRouter from './routes/readingRoute.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API ROUTES
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/shelf', shelfRouter);
app.use('/api/authors', authorRouter);
app.use('/api/reading', readingRouter);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'LIT ISLE Digital Library API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API documentation endpoint
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

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;