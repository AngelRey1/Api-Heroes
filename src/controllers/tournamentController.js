import tournamentService from '../services/tournamentService.js';

/**
 * Obtener torneos activos
 */
export const getActiveTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getActiveTournaments();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener torneos del usuario
 */
export const getUserTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getUserTournaments(req.user._id);
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Registrar usuario en torneo
 */
export const registerForTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.registerForTournament(req.params.id, req.user._id);
    res.json({ message: 'Registrado exitosamente', tournament });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Actualizar puntuación en torneo
 */
export const updateTournamentScore = async (req, res) => {
  try {
    const { score, time } = req.body;
    const result = await tournamentService.updateTournamentScore(req.params.id, req.user._id, score, time);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Finalizar torneo
 */
export const finalizeTournament = async (req, res) => {
  try {
    const result = await tournamentService.finalizeTournament(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Crear torneo semanal
 */
export const createWeeklyTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.createWeeklyTournament();
    res.json({ message: 'Torneo semanal creado', tournament });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Crear torneo mensual
 */
export const createMonthlyTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.createMonthlyTournament();
    res.json({ message: 'Torneo mensual creado', tournament });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Crear torneo especial
 */
export const createSpecialTournament = async (req, res) => {
  try {
    const { type, theme } = req.body;
    const tournament = await tournamentService.createSpecialTournament(type, theme);
    res.json({ message: 'Torneo especial creado', tournament });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtener liga del usuario
 */
export const getUserLeague = async (req, res) => {
  try {
    const league = await tournamentService.getUserLeague(req.user._id);
    res.json(league);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener ranking de liga
 */
export const getLeagueRanking = async (req, res) => {
  try {
    const { name, season } = req.params;
    const ranking = await tournamentService.getLeagueRanking(name, parseInt(season));
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualizar puntuación de liga
 */
export const updateLeagueScore = async (req, res) => {
  try {
    const { gameResult, score } = req.body;
    const result = await tournamentService.updateLeagueScore(req.params.id, req.user._id, gameResult, score);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Finalizar temporada de liga
 */
export const finalizeLeagueSeason = async (req, res) => {
  try {
    const result = await tournamentService.finalizeLeagueSeason(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Crear temporada de liga
 */
export const createLeagueSeason = async (req, res) => {
  try {
    const { leagueName, season } = req.body;
    const league = await tournamentService.createLeagueSeason(leagueName, season);
    res.json({ message: 'Temporada de liga creada', league });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 