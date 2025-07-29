import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  message: { type: String, maxlength: 100 },
  isClaimed: { type: Boolean, default: false },
  claimedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 días
});

export default mongoose.model('Gift', giftSchema); 