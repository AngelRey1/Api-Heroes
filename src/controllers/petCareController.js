import petCareService from "../services/petCareService.js";
import achievementService from '../services/achievementService.js';
import missionService from '../services/missionService.js';
import eventService from '../services/eventService.js';

/**
 * Alimentar a una mascota
 */
export const feedPet = async (req, res) => {
    try {
        const result = await petCareService.feedPet(req.params.petId, req.user._id);
        // Verificar logros de alimentación
        const achievementResult = await achievementService.checkFeedingAchievements(req.user._id);
        // Verificar progreso de misiones de alimentación
        const missionResult = await missionService.checkAndUpdateMissionProgress(req.user._id, 'feeding', 1);
        // Verificar progreso de eventos
        const eventResult = await eventService.checkAndUpdateEventProgress(req.user._id, 'feeding', 1);
        res.json({ ...result, achievements: achievementResult, missions: missionResult, events: eventResult });
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * Pasear a una mascota
 */
export const walkPet = async (req, res) => {
    try {
        const result = await petCareService.walkPet(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * Customizar una mascota
 */
export const customizePet = async (req, res) => {
    try {
        const { name, color, forma } = req.body;
        const result = await petCareService.customizePet(req.params.petId, req.user._id, { name, color, forma });
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * Jugar con una mascota
 */
export const playWithPet = async (req, res) => {
    try {
        const result = await petCareService.playWithPet(req.params.petId, req.user._id);
        // Verificar logros de juego
        const achievementResult = await achievementService.checkPlayingAchievements(req.user._id);
        // Verificar progreso de misiones de juego
        const missionResult = await missionService.checkAndUpdateMissionProgress(req.user._id, 'playing', 1);
        // Verificar progreso de eventos
        const eventResult = await eventService.checkAndUpdateEventProgress(req.user._id, 'playing', 1);
        res.json({ ...result, achievements: achievementResult, missions: missionResult, events: eventResult });
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * Bañar a una mascota
 */
export const bathPet = async (req, res) => {
    try {
        const result = await petCareService.bathPet(req.params.petId, req.user._id);
        // Verificar logros de limpieza
        const achievementResult = await achievementService.checkCleaningAchievements(req.user._id);
        // Verificar progreso de misiones de limpieza
        const missionResult = await missionService.checkAndUpdateMissionProgress(req.user._id, 'cleaning', 1);
        // Verificar progreso de eventos
        const eventResult = await eventService.checkAndUpdateEventProgress(req.user._id, 'cleaning', 1);
        res.json({ ...result, achievements: achievementResult, missions: missionResult, events: eventResult });
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * Hacer dormir a una mascota
 */
export const sleepPet = async (req, res) => {
    try {
        const result = await petCareService.sleepPet(req.params.petId, req.user._id);
        // Verificar logros de descanso
        const achievementResult = await achievementService.checkSleepingAchievements(req.user._id);
        // Verificar progreso de misiones de descanso
        const missionResult = await missionService.checkAndUpdateMissionProgress(req.user._id, 'sleeping', 1);
        // Verificar progreso de eventos
        const eventResult = await eventService.checkAndUpdateEventProgress(req.user._id, 'sleeping', 1);
        res.json({ ...result, achievements: achievementResult, missions: missionResult, events: eventResult });
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * Obtener estado de una mascota
 */
export const getPetStatus = async (req, res) => {
    try {
        const status = await petCareService.getPetStatus(req.params.petId, req.user._id);
        res.json(status);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * Obtener estadísticas de cuidado
 */
export const getCareStats = async (req, res) => {
    try {
        const stats = await petCareService.getCareStats(req.user._id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 