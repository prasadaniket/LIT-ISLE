import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true },
  metadata: { type: Object, default: {} },
  ip: { type: String },
  userAgent: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;


