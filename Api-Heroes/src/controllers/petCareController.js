import PetCareService from '../services/petCareService.js';

const petCareService = new PetCareService();

export const feedPet = async (req, res) => {
    try {
        console.log('feedPet - PetId:', req.params.id);
        console.log('feedPet - UserId:', req.user._id);
        console.log('feedPet - User:', req.user.username);
        
        const result = await petCareService.feedPet(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        console.error('feedPet - Error:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const playWithPet = async (req, res) => {
    try {
        const result = await petCareService.playWithPet(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        console.error('playWithPet - Error:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const bathPet = async (req, res) => {
    try {
        const result = await petCareService.bathPet(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        console.error('bathPet - Error:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const sleepPet = async (req, res) => {
    try {
        const result = await petCareService.sleepPet(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        console.error('sleepPet - Error:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const healPet = async (req, res) => {
    try {
        const result = await petCareService.healPet(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        console.error('healPet - Error:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const getPetStatus = async (req, res) => {
    try {
        const result = await petCareService.getPetStatus(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        console.error('getPetStatus - Error:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const checkAbandonment = async (req, res) => {
    try {
        const result = await petCareService.checkAbandonment(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        console.error('checkAbandonment - Error:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const getCareStats = async (req, res) => {
    try {
        const result = await petCareService.getCareStats(req.user._id);
        res.json(result);
    } catch (error) {
        console.error('getCareStats - Error:', error);
        res.status(500).json({ error: error.message });
    }
}; 