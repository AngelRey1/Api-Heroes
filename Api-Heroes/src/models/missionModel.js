import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  type: { type: String, enum: ['daily', 'weekly'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  progress: { type: Number, default: 0 },
  goal: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false },
  reward: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  secret: { type: Boolean, default: false },
  category: { type: String, enum: ['care', 'feeding', 'shop', 'achievement', 'social'], default: 'care' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  coinReward: { type: Number, default: 10 },
  icon: { type: String, default: '📋' },
  actionType: { type: String, description: 'Tipo de acción que cuenta para el progreso' }
});

export default mongoose.model('Mission', missionSchema); 