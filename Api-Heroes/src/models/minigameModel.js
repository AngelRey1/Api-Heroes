import mongoose from 'mongoose';

const minigameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['memory', 'speed', 'puzzle', 'reaction', 'math'], 
    required: true 
  },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  icon: { type: String, default: '🎮' },
  baseReward: { type: Number, default: 10 },
  maxReward: { type: Number, default: 50 },
  instructions: { type: String },
  settings: { type: Object, default: {} },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Minigame', minigameSchema); 