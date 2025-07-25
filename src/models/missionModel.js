import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  secret: { type: Boolean, default: false }
});

export default mongoose.model('Mission', missionSchema); 