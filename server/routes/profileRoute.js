import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getProfile,
    updateProfile,
    uploadProfileImage,
    getProfileCompletion
} from '../controllers/profileController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/user/profile - Get user profile
router.get('/profile', getProfile);

// PUT /api/user/profile - Update user profile
router.put('/profile', updateProfile);

// POST /api/user/profile/upload-image - Upload profile/cover image
router.post('/profile/upload-image', uploadProfileImage);

// GET /api/user/profile/completion - Get profile completion status
router.get('/profile/completion', getProfileCompletion);

export default router;
