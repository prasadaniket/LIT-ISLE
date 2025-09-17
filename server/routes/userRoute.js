import express from "express";
import { 
    loginUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile 
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes
userRouter.get('/profile', authenticateToken, getUserProfile);
userRouter.put('/profile', authenticateToken, updateUserProfile);

export default userRouter;