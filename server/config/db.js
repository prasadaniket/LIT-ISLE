/**
 * LIT ISLE - Database Configuration
 * 
 * This file handles MongoDB database connection for the LIT ISLE application.
 * It provides a centralized database connection function with error handling.
 * 
 * Key Features:
 * - MongoDB connection using Mongoose ODM
 * - Environment variable configuration
 * - Connection error handling
 * - Graceful failure with process exit
 * 
 * @author LIT ISLE Development Team
 * @version 1.0.0
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

// ===== ENVIRONMENT CONFIGURATION =====
// Load environment variables from .env file
dotenv.config();

/**
 * Connect to MongoDB Database
 * 
 * Establishes connection to MongoDB using the provided URI.
 * Handles connection errors and provides appropriate feedback.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} Throws error if connection fails
 */
export const connectDB = async () => {
    // Get MongoDB URI from environment variables or use default
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://talesofreaders:Readerunknown@clusterlivo.ycvogj0.mongodb.net/LIT-ISLE';
    
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        // Exit process if database connection fails
        process.exit(1);
    }
}