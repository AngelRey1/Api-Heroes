import express from "express";
import petCareService from "../services/petCareService.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cuidado de Mascota
 *     description: Endpoints para cuidar y personalizar la mascota tipo Pou
 */

/**
 * @swagger
 * /api/pet-care/{id}/feed:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Alimentar a la mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               food:
 *                 type: string
 *                 example: premium
 *     responses:
 *       200:
 *         description: Mascota alimentada
 */
router.post('/:id/feed', async (req, res) => {
    try {
        const { food } = req.body || {};
        const result = await petCareService.feedPet(req.params.id, food);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/walk:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Pasear a la mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota paseada
 */
router.post('/:id/walk', async (req, res) => {
    try {
        const result = await petCareService.walkPet(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/play:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Jugar con la mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota jugó
 */
router.post('/:id/play', async (req, res) => {
    try {
        const result = await petCareService.playWithPet(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/bath:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Bañar a la mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota bañada
 */
router.post('/:id/bath', async (req, res) => {
    try {
        const result = await petCareService.bathPet(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/customize:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Customizar la mascota (gratis o paga)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 example: sombrero
 *               type:
 *                 type: string
 *                 enum: [free, paid]
 *                 example: free
 *     responses:
 *       200:
 *         description: Mascota customizada
 */
router.post('/:id/customize', async (req, res) => {
    try {
        const { item, type } = req.body;
        const result = await petCareService.customizePet(req.params.id, item, type);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/heal:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Curar una enfermedad de la mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disease:
 *                 type: string
 *                 example: gripe
 *     responses:
 *       200:
 *         description: Mascota curada
 */
router.post('/:id/heal', async (req, res) => {
    try {
        const { disease } = req.body;
        const result = await petCareService.healPet(req.params.id, disease);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/sick:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Enfermar a la mascota (simulación)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disease:
 *                 type: string
 *                 example: gripe
 *     responses:
 *       200:
 *         description: Mascota enfermó
 */
router.post('/:id/sick', async (req, res) => {
    try {
        const { disease } = req.body;
        const result = await petCareService.makePetSick(req.params.id, disease);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/status:
 *   get:
 *     tags: [Cuidado de Mascota]
 *     summary: Ver estado de la mascota (vida, felicidad, personalidad, etc.)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Estado de la mascota
 */
router.get('/:id/status', async (req, res) => {
    try {
        const result = await petCareService.getPetStatus(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pet-care/{id}/decay:
 *   post:
 *     tags: [Cuidado de Mascota]
 *     summary: Disminuir vida/felicidad por abandono (simulación)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hours:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Stats decay
 */
router.post('/:id/decay', async (req, res) => {
    try {
        const { hours } = req.body || {};
        const result = await petCareService.decayPetStats(req.params.id, hours);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router; 