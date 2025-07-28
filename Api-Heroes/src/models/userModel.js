import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, description: 'Nombre de usuario único' },
  email: { type: String, required: true, unique: true, description: 'Correo electrónico del usuario' },
  password: { type: String, required: true, description: 'Contraseña encriptada' },
  displayName: { type: String, description: 'Nombre para mostrar (opcional)' },
  avatar: { type: String, description: 'URL del avatar (opcional)' },
  activo: { type: Boolean, default: true, description: 'Indica si el usuario está activo' },
  coins: { type: Number, default: 0, description: 'Monedas virtuales del usuario' },
  inventory: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, default: 1 }
    }
  ],
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
  achievementProgress: { type: Map, of: Number, default: new Map() },
  unlockedAchievements: [{
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    unlockedAt: { type: Date, default: Date.now }
  }],
  missionProgress: { type: Map, of: Number, default: new Map() },
  eventProgress: { type: Map, of: Number, default: new Map() },
  activeEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: {
    sent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    received: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  socialStats: {
    friendsCount: { type: Number, default: 0 },
    visitsReceived: { type: Number, default: 0 },
    giftsSent: { type: Number, default: 0 },
    giftsReceived: { type: Number, default: 0 }
  },
  missions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }],
  highScores: [{
    minigameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Minigame' },
    score: { type: Number, default: 0 }
  }],
  minigameStats: {
    gamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 }
  },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  heroes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hero' }],
  background: { type: String, default: '', description: 'Fondo visual personalizado del usuario' }
});

userSchema.method('toJSON', function() {
  const { password, __v, ...object } = this.toObject();
  return object;
});

export default mongoose.model('User', userSchema); 