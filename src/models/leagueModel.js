import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'], 
    required: true 
  },
  season: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'finished', 'upcoming'], 
    default: 'upcoming' 
  },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    heroName: { type: String },
    points: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    rank: { type: Number },
    previousRank: { type: Number },
    promotionThreshold: { type: Number, default: 1000 },
    relegationThreshold: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now }
  }],
  rewards: {
    promotion: { type: Number, default: 500 },
    relegation: { type: Number, default: 100 },
    participation: { type: Number, default: 50 },
    top3: [{ type: Number }], // [1000, 500, 250]
    special: { type: Number, default: 200 }
  },
  rules: {
    minGamesPerWeek: { type: Number, default: 5 },
    maxGamesPerDay: { type: Number, default: 10 },
    pointsPerWin: { type: Number, default: 10 },
    pointsPerLoss: { type: Number, default: 1 },
    pointsPerDraw: { type: Number, default: 3 },
    bonusPoints: { type: Number, default: 5 } // por racha de victorias
  },
  promotionRelegation: {
    promoteTo: { type: String, enum: ['silver', 'gold', 'platinum', 'diamond', null] },
    relegateTo: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum', null] },
    promoteCount: { type: Number, default: 3 }, // top 3 promocionan
    relegateCount: { type: Number, default: 3 }  // bottom 3 descienden
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Índices
leagueSchema.index({ name: 1, season: 1 });
leagueSchema.index({ status: 1, endDate: 1 });
leagueSchema.index({ 'participants.userId': 1 });

// Método para agregar participante
leagueSchema.methods.addParticipant = function(user) {
  const existingParticipant = this.participants.find(p => p.userId.toString() === user._id.toString());
  if (existingParticipant) {
    throw new Error('Usuario ya está en esta liga');
  }

  this.participants.push({
    userId: user._id,
    username: user.username,
    heroName: user.heroes && user.heroes.length > 0 ? user.heroes[0].name : user.username,
    points: 0,
    rank: this.participants.length + 1
  });

  return this.save();
};

// Método para actualizar puntuación
leagueSchema.methods.updateParticipantScore = function(userId, gameResult, score) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (!participant) {
    throw new Error('Participante no encontrado');
  }

  participant.gamesPlayed += 1;
  participant.lastActivity = new Date();

  switch (gameResult) {
    case 'win':
      participant.wins += 1;
      participant.points += this.rules.pointsPerWin;
      break;
    case 'loss':
      participant.losses += 1;
      participant.points += this.rules.pointsPerLoss;
      break;
    case 'draw':
      participant.draws += 1;
      participant.points += this.rules.pointsPerDraw;
      break;
  }

  // Bonus por racha de victorias
  if (participant.wins >= 3 && participant.wins % 3 === 0) {
    participant.points += this.rules.bonusPoints;
  }

  return this.save();
};

// Método para recalcular rankings
leagueSchema.methods.recalculateRankings = function() {
  this.participants.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // En caso de empate, considerar wins
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    // Si sigue empate, considerar gamesPlayed
    return a.gamesPlayed - b.gamesPlayed;
  });

  this.participants.forEach((participant, index) => {
    participant.previousRank = participant.rank;
    participant.rank = index + 1;
  });

  return this.save();
};

// Método para finalizar temporada
leagueSchema.methods.finalizeSeason = function() {
  this.recalculateRankings();
  
  const promotions = [];
  const relegations = [];

  // Determinar promociones
  if (this.promotionRelegation.promoteTo) {
    for (let i = 0; i < this.promotionRelegation.promoteCount; i++) {
      if (this.participants[i]) {
        promotions.push({
          userId: this.participants[i].userId,
          username: this.participants[i].username,
          fromLeague: this.name,
          toLeague: this.promotionRelegation.promoteTo,
          rank: this.participants[i].rank,
          points: this.participants[i].points
        });
      }
    }
  }

  // Determinar descensos
  if (this.promotionRelegation.relegateTo) {
    const startIndex = this.participants.length - this.promotionRelegation.relegateCount;
    for (let i = startIndex; i < this.participants.length; i++) {
      if (this.participants[i]) {
        relegations.push({
          userId: this.participants[i].userId,
          username: this.participants[i].username,
          fromLeague: this.name,
          toLeague: this.promotionRelegation.relegateTo,
          rank: this.participants[i].rank,
          points: this.participants[i].points
        });
      }
    }
  }

  this.status = 'finished';
  this.updatedAt = new Date();

  return {
    league: this,
    promotions,
    relegations
  };
};

export default mongoose.model('League', leagueSchema); 