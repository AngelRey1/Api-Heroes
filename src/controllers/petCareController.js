import express from "express";
import petCareService from "../services/petCareService.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cuidado de Mascota
 *     description: Endpoints para cuidar y personalizar la mascota tipo Pou
 */

/**
 * @swagger
 * /api/pet-care/{petId}/feed:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Alimentar a una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               food:
 *                 type: string
 *                 description: Tipo de comida
 *                 example: "Croquetas"
 *     responses:
 *       200:
 *         description: Mascota alimentada
 */
router.post('/:petId/feed', authMiddleware, async (req, res) => {
    try {
        const { food } = req.body || {};
        const result = await petCareService.feedPet(req.params.petId, food, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/walk:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Pasear a una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota paseada
 */
router.post('/:petId/walk', authMiddleware, async (req, res) => {
    try {
        const result = await petCareService.walkPet(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/customize:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Customizar una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item
 *               - type
 *             properties:
 *               item:
 *                 type: string
 *                 description: Objeto de customización
 *                 example: "Sombrero"
 *               type:
 *                 type: string
 *                 description: Tipo de customización
 *                 example: "accesorio"
 *     responses:
 *       200:
 *         description: Mascota customizada
 */
router.post('/:petId/customize', authMiddleware, async (req, res) => {
    try {
        const { item, type } = req.body;
        const result = await petCareService.customizePet(req.params.petId, item, type, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/heal:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Curar una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disease
 *             properties:
 *               disease:
 *                 type: string
 *                 description: Enfermedad a curar
 *                 example: "Gripe"
 *     responses:
 *       200:
 *         description: Mascota curada
 */
router.post('/:petId/heal', authMiddleware, async (req, res) => {
    try {
        const { disease } = req.body;
        const result = await petCareService.healPet(req.params.petId, disease, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/sick:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Enfermar a una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disease
 *             properties:
 *               disease:
 *                 type: string
 *                 description: Enfermedad a aplicar
 *                 example: "Gripe"
 *     responses:
 *       200:
 *         description: Mascota enfermada
 */
router.post('/:petId/sick', authMiddleware, async (req, res) => {
    try {
        const { disease } = req.body;
        const result = await petCareService.makePetSick(req.params.petId, disease, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/decay:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Simular decaimiento de una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hours:
 *                 type: integer
 *                 description: Horas de decaimiento a simular
 *                 example: 5
 *     responses:
 *       200:
 *         description: Decaimiento simulado
 */
router.post('/:petId/decay', authMiddleware, async (req, res) => {
    try {
        const { hours } = req.body || {};
        const result = await petCareService.decayPetStats(req.params.petId, hours, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/play:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Jugar con una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota jugó
 */
router.post('/:petId/play', authMiddleware, async (req, res) => {
    try {
        const result = await petCareService.playWithPet(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/bath:
 *   post:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Bañar a una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota bañada
 */
router.post('/:petId/bath', authMiddleware, async (req, res) => {
    try {
        const result = await petCareService.bathPet(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{petId}/status:
 *   get:
 *     tags:
 *       - Cuidado de Mascota
 *     summary: Obtener el estado de una mascota
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de la mascota
 */
router.get('/:petId/status', authMiddleware, async (req, res) => {
    try {
        const result = await petCareService.getPetStatus(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(404).json({ error: error.message });
    }
});

export default router; 