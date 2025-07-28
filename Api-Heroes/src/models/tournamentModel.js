import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['weekly', 'monthly', 'special', 'league', 'championship'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['upcoming', 'active', 'finished', 'cancelled'], 
    default: 'upcoming' 
  },
  league: {
    name: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'], default: 'bronze' },
    minLevel: { type: Number, default: 1 },
    maxLevel: { type: Number, default: 999 }
  },
  gameType: { 
    type: String, 
    enum: ['memory', 'speed', 'puzzle', 'reaction', 'math', 'mixed'], 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  maxParticipants: { type: Number, default: 100 },
  currentParticipants: { type: Number, default: 0 },
  entryFee: { type: Number, default: 0 },
  prizePool: {
    first: { type: Number, default: 1000 },
    second: { type: Number, default: 500 },
    third: { type: Number, default: 250 },
    participation: { type: Number, default: 10 }
  },
  rules: {
    maxAttempts: { type: Number, default: 3 },
    timeLimit: { type: Number, default: 300 }, // segundos
    scoringMethod: { type: String, enum: ['highest_score', 'best_time', 'most_attempts'], default: 'highest_score' }
  },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    heroName: { type: String },
    joinedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['registered', 'active', 'eliminated', 'winner'], default: 'registered' },
    bestScore: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },
    totalTime: { type: Number, default: 0 },
    rank: { type: Number }
  }],
  results: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    heroName: { type: String },
    score: { type: Number },
    time: { type: Number },
    rank: { type: Number },
    prize: { type: Number },
    awardedAt: { type: Date }
  }],
  theme: {
    backgroundColor: { type: String, default: '#ff6b6b' },
    textColor: { type: String, default: '#ffffff' },
    icon: { type: String, default: '🏆' },
    specialEffects: [{ type: String }]
  },
  requirements: {
    minLevel: { type: Number, default: 1 },
    minGamesPlayed: { type: Number, default: 0 },
    minAchievements: { type: Number, default: 0 },
    requiredItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Índices para consultas eficientes
tournamentSchema.index({ status: 1, startDate: 1 });
tournamentSchema.index({ type: 1, league: 1 });
tournamentSchema.index({ 'participants.userId': 1 });
tournamentSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

// Método para verificar si un usuario puede participar
tournamentSchema.methods.canParticipate = function(user) {
  if (this.currentParticipants >= this.maxParticipants) return false;
  if (new Date() > this.registrationDeadline) return false;
  if (user.level < this.requirements.minLevel) return false;
  if (user.gamesPlayed < this.requirements.minGamesPlayed) return false;
  if (user.unlockedAchievements.length < this.requirements.minAchievements) return false;
  
  // Verificar si ya está registrado
  const isRegistered = this.participants.some(p => p.userId.toString() === user._id.toString());
  return !isRegistered;
};

// Método para registrar un participante
tournamentSchema.methods.registerParticipant = function(user) {
  if (!this.canParticipate(user)) {
    throw new Error('Usuario no puede participar en este torneo');
  }

  this.participants.push({
    userId: user._id,
    username: user.username,
    heroName: user.heroes && user.heroes.length > 0 ? user.heroes[0].name : user.username,
    joinedAt: new Date()
  });

  this.currentParticipants += 1;
  return this.save();
};

// Método para actualizar puntuación de participante
tournamentSchema.methods.updateParticipantScore = function(userId, score, time) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (!participant) {
    throw new Error('Participante no encontrado');
  }

  participant.attempts += 1;
  participant.lastAttemptAt = new Date();
  participant.totalTime += time || 0;

  if (score > participant.bestScore) {
    participant.bestScore = score;
  }

  return this.save();
};

// Método para finalizar torneo y calcular resultados
tournamentSchema.methods.finalizeTournament = function() {
  if (this.status !== 'active') {
    throw new Error('Torneo no está activo');
  }

  // Ordenar participantes por puntuación
  const sortedParticipants = this.participants
    .filter(p => p.attempts > 0)
    .sort((a, b) => b.bestScore - a.bestScore);

  // Asignar rankings y premios
  this.results = sortedParticipants.map((participant, index) => {
    const rank = index + 1;
    let prize = 0;

    if (rank === 1) prize = this.prizePool.first;
    else if (rank === 2) prize = this.prizePool.second;
    else if (rank === 3) prize = this.prizePool.third;
    else prize = this.prizePool.participation;

    return {
      userId: participant.userId,
      username: participant.username,
      heroName: participant.heroName,
      score: participant.bestScore,
      time: participant.totalTime,
      rank,
      prize,
      awardedAt: new Date()
    };
  });

  this.status = 'finished';
  this.updatedAt = new Date();
  return this.save();
};

export default mongoose.model('Tournament', tournamentSchema); 