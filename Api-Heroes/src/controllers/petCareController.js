import PetService from '../services/petService.js';
const petService = new PetService();

/**
 * Alimentar mascota
 */
export const feedPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const { foodType } = req.body;
        const userId = req.user._id;
        const result = await petService.feedPet(petId, userId, foodType);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Dar agua a la mascota
 */
export const waterPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const { waterType } = req.body;
        const userId = req.user._id;
        const result = await petService.waterPet(petId, userId, waterType);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Jugar con la mascota
 */
export const playWithPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.playWithPet(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Pasear la mascota
 */
export const walkPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.walkPet(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Bañar la mascota
 */
export const bathePet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.bathePet(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Hacer dormir la mascota
 */
export const sleepPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.sleepPet(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Despertar la mascota
 */
export const wakePet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.wakePet(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Acariciar la mascota
 */
export const petPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.petPet(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Curar la mascota
 */
export const healPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.healPet(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtener estadísticas de la mascota
 */
export const getPetStatus = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id;
        const result = await petService.getPetStats(petId, userId);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtener historial de actividades de la mascota
 */
export const getPetActivityHistory = async (req, res) => {
    try {
        const { petId } = req.params;
        const { limit } = req.query;
        const userId = req.user._id;
        const result = await petService.getPetActivityHistory(petId, userId, parseInt(limit) || 10);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
}; 