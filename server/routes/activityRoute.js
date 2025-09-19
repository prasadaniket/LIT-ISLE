import express from 'express';
import Activity from '../models/activityModel.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get current user's activity (visible to the user)
router.get('/me', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, activities });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to load activity' });
  }
});

// Admin: get any user's activity with query ?userId=
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const { userId, limit = 200 } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, activities });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to load activity' });
  }
});

export default router;

// Create an activity entry (authenticated user only)
router.post('/', protect, async (req, res) => {
  try {
    const { action, metadata = {} } = req.body || {};
    if (!action) return res.status(400).json({ success: false, message: 'action is required' });
    const activity = await Activity.create({
      userId: req.user.id,
      action,
      metadata,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ success: true, activity });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to record activity' });
  }
});


