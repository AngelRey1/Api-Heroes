import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
  type: { 
    type: String, 
    enum: ['text', 'system', 'gift', 'achievement'], 
    default: 'text' 
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  metadata: {
    giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' },
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    emoji: { type: String },
    attachment: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Índice para consultas eficientes de conversaciones
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });

export default mongoose.model('Message', messageSchema); 