/**
 * LIT ISLE - Server Entry Point
 * 
 * This is the main entry point for the LIT ISLE Node.js/Express server.
 * It handles database connection, server startup, and graceful shutdown.
 * 
 * Key Features:
 * - MongoDB database connection
 * - Express server initialization
 * - Environment variable configuration
 * - Graceful error handling and shutdown
 * 
 * @author LIT ISLE Development Team
 * @version 1.0.0
 */

import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

// ===== ENVIRONMENT CONFIGURATION =====
// Load environment variables from .env file
dotenv.config();

// ===== SERVER CONFIGURATION =====
const PORT = process.env.PORT || 4000;

/**
 * Start Server Function
 * 
 * Initializes database connection and starts the Express server.
 * Handles connection errors and provides graceful error handling.
 */
const startServer = async () => {
    try {
        // Connect to MongoDB database
        await connectDB();
        
        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`✅ Database Connected Successfully`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// ===== SERVER INITIALIZATION =====
startServer();

// ===== ERROR HANDLING & GRACEFUL SHUTDOWN =====

/**
 * Unhandled Promise Rejection Handler
 * 
 * Catches unhandled promise rejections and gracefully shuts down the server.
 * This prevents the server from crashing due to unhandled async errors.
 */
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

/**
 * Uncaught Exception Handler
 * 
 * Catches uncaught exceptions and gracefully shuts down the server.
 * This is the last line of defense against unexpected errors.
 */
process.on('uncaughtException', (err) => {
    console.log(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});

/**
 * SIGTERM Signal Handler
 * 
 * Handles termination signals from the system (e.g., Docker, PM2).
 * Allows for graceful shutdown of the server.
 */
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

/**
 * SIGINT Signal Handler
 * 
 * Handles interrupt signals (Ctrl+C) for graceful shutdown.
 * Allows for clean server shutdown during development.
 */
process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
