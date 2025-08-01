import Tournament from '../models/tournamentModel.js';
import League from '../models/leagueModel.js';
import User from '../models/userModel.js';
import notificationService from './notificationService.js';

// Crear torneo semanal automático
async function createWeeklyTournament() {
  const now = new Date();
  const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Mañana
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días
  const registrationDeadline = new Date(startDate.getTime() - 2 * 60 * 60 * 1000); // 2 horas antes

  const gameTypes = ['memory', 'speed', 'puzzle', 'reaction', 'math'];
  const randomGameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];

  const tournament = new Tournament({
    name: `Torneo Semanal - ${randomGameType.charAt(0).toUpperCase() + randomGameType.slice(1)}`,
    description: `Compite en el torneo semanal de ${randomGameType}. ¡Demuestra tus habilidades y gana premios!`,
    type: 'weekly',
    gameType: randomGameType,
    startDate,
    endDate,
    registrationDeadline,
    maxParticipants: 50,
    prizePool: {
      first: 1000,
      second: 500,
      third: 250,
      participation: 25
    },
    theme: {
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff',
      icon: '🏆',
      specialEffects: ['sparkle', 'glow']
    }
  });

  await tournament.save();
  console.log(`[TOURNAMENT] Torneo semanal creado: ${tournament.name}`);
  return tournament;
}

// Crear torneo mensual
async function createMonthlyTournament() {
  const now = new Date();
  const startDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // En una semana
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días
  const registrationDeadline = new Date(startDate.getTime() - 24 * 60 * 60 * 1000); // 1 día antes

  const tournament = new Tournament({
    name: 'Torneo Mensual - Campeonato General',
    description: 'El torneo más importante del mes. Compite en todos los juegos y demuestra que eres el mejor.',
    type: 'monthly',
    gameType: 'mixed',
    startDate,
    endDate,
    registrationDeadline,
    maxParticipants: 100,
    entryFee: 50,
    prizePool: {
      first: 5000,
      second: 2500,
      third: 1000,
      participation: 50
    },
    rules: {
      maxAttempts: 5,
      timeLimit: 600,
      scoringMethod: 'highest_score'
    },
    theme: {
      backgroundColor: '#a55eea',
      textColor: '#ffffff',
      icon: '👑',
      specialEffects: ['crown', 'sparkle', 'glow']
    }
  });

  await tournament.save();
  console.log(`[TOURNAMENT] Torneo mensual creado: ${tournament.name}`);
  return tournament;
}

// Crear torneo especial
async function createSpecialTournament(type, theme) {
  const now = new Date();
  const startDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // En 3 días
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días
  const registrationDeadline = new Date(startDate.getTime() - 12 * 60 * 60 * 1000); // 12 horas antes

  const specialTournaments = {
    halloween: {
      name: 'Torneo de Halloween - Juegos de Terror',
      description: '¡Un torneo espeluznante! Compite en juegos con temática de Halloween.',
      gameType: 'mixed',
      theme: {
        backgroundColor: '#ff6348',
        textColor: '#ffffff',
        icon: '🎃',
        specialEffects: ['ghost', 'spider', 'fog']
      }
    },
    christmas: {
      name: 'Torneo Navideño - Espíritu Festivo',
      description: '¡Celebra la Navidad con este torneo especial! Premios festivos incluidos.',
      gameType: 'mixed',
      theme: {
        backgroundColor: '#2ed573',
        textColor: '#ffffff',
        icon: '🎄',
        specialEffects: ['snow', 'lights', 'gift']
      }
    },
    summer: {
      name: 'Torneo de Verano - Juegos Calurosos',
      description: '¡Refréscate con este torneo de verano! Juegos con temática playera.',
      gameType: 'mixed',
      theme: {
        backgroundColor: '#ffa502',
        textColor: '#ffffff',
        icon: '🏖️',
        specialEffects: ['sun', 'wave', 'palm']
      }
    }
  };

  const config = specialTournaments[type] || specialTournaments.halloween;

  const tournament = new Tournament({
    name: config.name,
    description: config.description,
    type: 'special',
    gameType: config.gameType,
    startDate,
    endDate,
    registrationDeadline,
    maxParticipants: 75,
    entryFee: 25,
    prizePool: {
      first: 2000,
      second: 1000,
      third: 500,
      participation: 30
    },
    theme: config.theme
  });

  await tournament.save();
  console.log(`[TOURNAMENT] Torneo especial creado: ${tournament.name}`);
  return tournament;
}

// Obtener torneos activos
async function getActiveTournaments() {
  const tournaments = await Tournament.find({
    status: { $in: ['upcoming', 'active'] },
    endDate: { $gt: new Date() }
  }).sort({ startDate: 1 });

  return tournaments;
}

// Obtener torneos del usuario
async function getUserTournaments(userId) {
  const tournaments = await Tournament.find({
    'participants.userId': userId
  }).sort({ startDate: -1 });

  return tournaments;
}

// Registrar usuario en torneo
async function registerForTournament(tournamentId, userId) {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new Error('Torneo no encontrado');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (!tournament.canParticipate(user)) {
    throw new Error('No puedes participar en este torneo');
  }

  // Verificar si tiene suficientes monedas para la cuota de entrada
  if (tournament.entryFee > 0 && user.coins < tournament.entryFee) {
    throw new Error('No tienes suficientes monedas para la cuota de entrada');
  }

  // Cobrar cuota de entrada
  if (tournament.entryFee > 0) {
    user.coins -= tournament.entryFee;
    await user.save();
  }

  await tournament.registerParticipant(user);

  // Notificar al usuario
  await notificationService.createNotification(
    userId,
    'tournament',
    '¡Registrado en Torneo!',
    `Te has registrado exitosamente en "${tournament.name}"`,
    '🏆',
    'medium',
    { tournamentId: tournament._id }
  );

  return tournament;
}

// Actualizar puntuación en torneo
async function updateTournamentScore(tournamentId, userId, score, time) {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new Error('Torneo no encontrado');
  }

  if (tournament.status !== 'active') {
    throw new Error('El torneo no está activo');
  }

  await tournament.updateParticipantScore(userId, score, time);

  // Notificar al usuario sobre su puntuación
  await notificationService.createNotification(
    userId,
    'tournament',
    'Puntuación Actualizada',
    `Tu puntuación en "${tournament.name}" ha sido actualizada: ${score} puntos`,
    '📊',
    'low',
    { tournamentId: tournament._id, score }
  );

  return tournament;
}

// Finalizar torneo
async function finalizeTournament(tournamentId) {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new Error('Torneo no encontrado');
  }

  const result = await tournament.finalizeTournament();

  // Distribuir premios
  for (const resultItem of result.results) {
    const user = await User.findById(resultItem.userId);
    if (user) {
      user.coins += resultItem.prize;
      await user.save();

      // Notificar al usuario sobre su premio
      await notificationService.createNotification(
        resultItem.userId,
        'tournament',
        '¡Premio de Torneo!',
        `Has ganado ${resultItem.prize} monedas en "${tournament.name}" (Posición: ${resultItem.rank})`,
        '💰',
        'high',
        { tournamentId: tournament._id, prize: resultItem.prize, rank: resultItem.rank }
      );
    }
  }

  return result;
}

// Sistema de Ligas
async function createLeagueSeason(leagueName, season) {
  const now = new Date();
  const startDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // En una semana
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días

  const league = new League({
    name: leagueName,
    season,
    startDate,
    endDate,
    status: 'upcoming'
  });

  await league.save();
  console.log(`[LEAGUE] Liga ${leagueName} temporada ${season} creada`);
  return league;
}

// Obtener liga activa del usuario
async function getUserLeague(userId) {
  const league = await League.findOne({
    status: 'active',
    'participants.userId': userId
  });

  return league;
}

// Obtener ranking de liga
async function getLeagueRanking(leagueName, season) {
  const league = await League.findOne({ name: leagueName, season });
  if (!league) {
    throw new Error('Liga no encontrada');
  }

  return league.participants.sort((a, b) => a.rank - b.rank);
}

// Actualizar puntuación en liga
async function updateLeagueScore(leagueId, userId, gameResult, score) {
  const league = await League.findById(leagueId);
  if (!league) {
    throw new Error('Liga no encontrada');
  }

  await league.updateParticipantScore(userId, gameResult, score);
  await league.recalculateRankings();

  return league;
}

// Finalizar temporada de liga
async function finalizeLeagueSeason(leagueId) {
  const league = await League.findById(leagueId);
  if (!league) {
    throw new Error('Liga no encontrada');
  }

  const result = await league.finalizeSeason();

  // Distribuir premios de liga
  for (const participant of league.participants) {
    const user = await User.findById(participant.userId);
    if (user) {
      let prize = league.rewards.participation;

      // Premios por posición
      if (participant.rank <= 3) {
        prize += league.rewards.top3[participant.rank - 1] || 0;
      }

      // Premios por promoción/descenso
      const promotion = result.promotions.find(p => p.userId.toString() === participant.userId.toString());
      const relegation = result.relegations.find(p => p.userId.toString() === participant.userId.toString());

      if (promotion) {
        prize += league.rewards.promotion;
      } else if (relegation) {
        prize += league.rewards.relegation;
      }

      user.coins += prize;
      await user.save();

      // Notificar al usuario
      await notificationService.createNotification(
        participant.userId,
        'league',
        '¡Fin de Temporada de Liga!',
        `Has ganado ${prize} monedas en la liga ${league.name} (Posición: ${participant.rank})`,
        '🏅',
        'high',
        { leagueId: league._id, prize, rank: participant.rank }
      );
    }
  }

  return result;
}

// Programar torneos automáticos
async function scheduleAutomaticTournaments() {
  const now = new Date();
  
  // Verificar si necesitamos crear torneo semanal
  const lastWeeklyTournament = await Tournament.findOne({
    type: 'weekly',
    startDate: { $lt: now }
  }).sort({ startDate: -1 });

  if (!lastWeeklyTournament || 
      (now - lastWeeklyTournament.startDate) > (7 * 24 * 60 * 60 * 1000)) {
    await createWeeklyTournament();
  }

  // Verificar si necesitamos crear torneo mensual
  const lastMonthlyTournament = await Tournament.findOne({
    type: 'monthly',
    startDate: { $lt: now }
  }).sort({ startDate: -1 });

  if (!lastMonthlyTournament || 
      (now - lastMonthlyTournament.startDate) > (30 * 24 * 60 * 60 * 1000)) {
    await createMonthlyTournament();
  }
}

export default {
  createWeeklyTournament,
  createMonthlyTournament,
  createSpecialTournament,
  getActiveTournaments,
  getUserTournaments,
  registerForTournament,
  updateTournamentScore,
  finalizeTournament,
  createLeagueSeason,
  getUserLeague,
  getLeagueRanking,
  updateLeagueScore,
  finalizeLeagueSeason,
  scheduleAutomaticTournaments
}; 