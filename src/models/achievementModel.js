import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  criteria: { type: String },
  reward: { type: Object, default: {} },
  icon: { type: String, default: '🏆' },
  type: { type: String, enum: ['feeding', 'care', 'pets', 'coins', 'missions', 'shop', 'secret'], default: 'care' },
  requiredProgress: { type: Number, default: 1 },
  coinReward: { type: Number, default: 10 },
  isSecret: { type: Boolean, default: false }
});

export default mongoose.model('Achievement', achievementSchema); 