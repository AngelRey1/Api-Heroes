import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['achievement', 'mission', 'event', 'gift', 'friend_request', 'chat', 'system', 'pet_care'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  icon: { type: String, default: '🔔' },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  metadata: {
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' },
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    action: { type: String },
    reward: { type: Number }
  },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Índices para consultas eficientes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Notification', notificationSchema); 