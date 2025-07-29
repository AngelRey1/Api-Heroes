import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: {
    content: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Índice para buscar conversaciones por participantes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

// Método para obtener el otro participante
conversationSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(p => p.toString() !== userId.toString());
};

export default mongoose.model('Conversation', conversationSchema); 