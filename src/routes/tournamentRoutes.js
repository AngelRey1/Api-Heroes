import express from 'express';
import { getActiveTournaments, getUserTournaments, registerForTournament, updateTournamentScore, finalizeTournament, createWeeklyTournament, createMonthlyTournament, createSpecialTournament, getUserLeague, getLeagueRanking, updateLeagueScore, finalizeLeagueSeason, createLeagueSeason } from '../controllers/tournamentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de torneos
router.get('/', getActiveTournaments);
router.get('/user', authMiddleware, getUserTournaments);
router.post('/:id/register', authMiddleware, registerForTournament);
router.post('/:id/score', authMiddleware, updateTournamentScore);
router.post('/:id/finalize', authMiddleware, finalizeTournament);
router.post('/create-weekly', authMiddleware, createWeeklyTournament);
router.post('/create-monthly', authMiddleware, createMonthlyTournament);
router.post('/create-special', authMiddleware, createSpecialTournament);

// Rutas de ligas
router.get('/leagues/user', authMiddleware, getUserLeague);
router.get('/leagues/:name/:season/ranking', getLeagueRanking);
router.post('/leagues/:id/score', authMiddleware, updateLeagueScore);
router.post('/leagues/:id/finalize', authMiddleware, finalizeLeagueSeason);
router.post('/leagues/create-season', authMiddleware, createLeagueSeason);

export default router; 