import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['feeding_frenzy', 'care_marathon', 'shopping_spree', 'pet_party', 'hero_challenge'], 
    required: true 
  },
  icon: { type: String, default: '🎉' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  rewards: {
    coins: { type: Number, default: 0 },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    specialReward: { type: String }
  },
  objectives: [{
    action: { type: String, required: true },
    target: { type: Number, required: true },
    description: { type: String, required: true },
    reward: { type: Number, default: 0 }
  }],
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Map, of: Number, default: new Map() },
    completed: [{ type: String }],
    joinedAt: { type: Date, default: Date.now }
  }],
  theme: {
    backgroundColor: { type: String, default: '#ff6b6b' },
    textColor: { type: String, default: '#ffffff' },
    specialEffects: [{ type: String }]
  }
});

export default mongoose.model('Event', eventSchema); 