import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  criteria: { type: String },
  reward: { type: Object, default: {} },
});

export default mongoose.model('Achievement', achievementSchema); 