import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "24h";

// Generate JWT token
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRE 
    });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: "7d" 
    });
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

// Generate password reset token
export const generatePasswordResetToken = (userId) => {
    return jwt.sign({ userId, type: 'password_reset' }, JWT_SECRET, { 
        expiresIn: "1h" 
    });
};

// Generate email verification token
export const generateEmailVerificationToken = (userId) => {
    return jwt.sign({ userId, type: 'email_verification' }, JWT_SECRET, { 
        expiresIn: "24h" 
    });
};
