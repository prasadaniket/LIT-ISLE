import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access token required" 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user from database to ensure user still exists
        const user = await userModel.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "User not found" 
            });
        }

        if (!user.isActive) {
            return res.status(401).json({ 
                success: false,
                message: "Account is deactivated" 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token" 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Token expired" 
            });
        }
        res.status(500).json({ 
            success: false,
            message: "Authentication failed" 
        });
    }
};

// Check if user is author
export const isAuthor = (req, res, next) => {
    if (req.user.role !== "author" && req.user.role !== "admin") {
        return res.status(403).json({ 
            success: false,
            message: "Access denied. Authors only." 
        });
    }
    next();
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ 
            success: false,
            message: "Access denied. Admin only." 
        });
    }
    next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await userModel.findById(decoded.userId).select('-password');
            if (user && user.isActive) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
