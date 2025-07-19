import express from "express";
import { check, validationResult } from 'express-validator';
import HeroService from "../services/heroService.js";
import Hero from "../models/heroModel.js";
import petRepository from "../repositories/petRepository.js";
import authMiddleware from '../middleware/authMiddleware.js';
import { toBasicPet } from '../services/petService.js';

const router = express.Router();
const heroService = new HeroService();

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     tags:
 *       - Superhéroes
 *     summary: Obtiene todos los héroes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de héroes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 */
router.get("/heroes", authMiddleware, async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes(req.user._id);
        res.json(heroes);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes:
 *   post:
 *     tags:
 *       - Superhéroes
 *     summary: Agrega un nuevo héroe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - alias
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre real del superhéroe
 *                 example: "Roberto Gómez Bolaños"
 *               alias:
 *                 type: string
 *                 description: Nombre de superhéroe o alias
 *                 example: "Chapulín Colorado"
 *               city:
 *                 type: string
 *                 description: Ciudad donde opera el héroe
 *                 example: "CDMX"
 *               team:
 *                 type: string
 *                 description: Equipo o grupo al que pertenece
 *                 example: "Independiente"
 *     responses:
 *       201:
 *         description: Héroe creado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post("/heroes",
    [
        authMiddleware,
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array() });
        }
        try {
            const { name, alias, city, team } = req.body;
            const addedHero = await heroService.addHero({ name, alias, city, team, owner: req.user._id });
            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

/**
 * @swagger
 * /api/heroes/city/{city}:
 *   get:
 *     tags:
 *       - Superhéroes
 *     summary: Busca héroes por ciudad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad a buscar
 *     responses:
 *       200:
 *         description: Lista de héroes de la ciudad
 *       401:
 *         description: No autorizado
 */
router.get('/heroes/city/:city', authMiddleware, async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city, req.user._id);
        res.json(heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/heroes/{heroId}/enfrentar:
 *   post:
 *     tags:
 *       - Superhéroes
 *     summary: Enfrenta a un héroe específico con un villano
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: heroId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del héroe que enfrentará al villano
 *         example: 68785027
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - villain
 *             properties:
 *               villain:
 *                 type: string
 *                 description: Nombre del villano a enfrentar
 *                 example: "Joker"
 *     responses:
 *       200:
 *         description: Mensaje de enfrentamiento
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Héroe no encontrado
 */
router.post('/heroes/:heroId/enfrentar', authMiddleware, async (req, res) => {
    try {
        const result = await heroService.faceVillain(req.params.heroId, req.body.villain, req.user._id);
        res.json({ message: result });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/heroes/{heroId}/pets:
 *   get:
 *     tags:
 *       - Superhéroes
 *     summary: Lista las mascotas adoptadas por un héroe específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: heroId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del héroe del cual ver las mascotas
 *         example: 68785027
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas por el héroe
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Héroe no encontrado
 */
router.get('/heroes/:heroId/pets', authMiddleware, async (req, res) => {
    try {
        const pets = await heroService.getHeroPets(req.params.heroId, req.user._id);
        res.json(pets);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes/{heroId}:
 *   put:
 *     tags:
 *       - Superhéroes
 *     summary: Actualiza los datos de un héroe específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: heroId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del héroe a actualizar
 *         example: 68785027
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre real del superhéroe
 *                 example: "Roberto Gómez Bolaños"
 *               alias:
 *                 type: string
 *                 description: Nombre de superhéroe o alias
 *                 example: "Chapulín Colorado"
 *               city:
 *                 type: string
 *                 description: Ciudad donde opera el héroe
 *                 example: "CDMX"
 *               team:
 *                 type: string
 *                 description: Equipo o grupo al que pertenece
 *                 example: "Independiente"
 *     responses:
 *       200:
 *         description: Héroe actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Héroe no encontrado
 */
router.put("/heroes/:heroId", authMiddleware, async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.heroId, req.body, req.user._id);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes/{heroId}:
 *   delete:
 *     tags:
 *       - Superhéroes
 *     summary: Elimina un héroe específico y todas sus relaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: heroId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del héroe a eliminar
 *         example: 68785027
 *     responses:
 *       200:
 *         description: Héroe eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Héroe no encontrado
 */
router.delete('/heroes/:heroId', authMiddleware, async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.heroId, req.user._id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *           description: ID único de MongoDB
 *         id_corto:
 *           type: string
 *           example: "64a1b2c3"
 *           description: ID corto para mostrar o copiar fácilmente
 *         name:
 *           type: string
 *           example: "Roberto Gómez Bolaños"
 *           description: Nombre real del superhéroe
 *         alias:
 *           type: string
 *           example: "Chapulín Colorado"
 *           description: Nombre de superhéroe o alias
 *         city:
 *           type: string
 *           example: "CDMX"
 *           description: Ciudad donde opera el héroe
 *         team:
 *           type: string
 *           example: "Independiente"
 *           description: Equipo o grupo al que pertenece
 *         pets:
 *           type: array
 *           description: Mascotas adoptadas por el héroe
 *           items:
 *             type: string
 *       example:
 *         _id: "64a1b2c3d4e5f6a7b8c9d0e1"
 *         id_corto: "64a1b2c3"
 *         name: "Roberto Gómez Bolaños"
 *         alias: "Chapulín Colorado"
 *         city: "CDMX"
 *         team: "Independiente"
 *         pets: ["64a1b2c3d4e5f6a7b8c9d0e2", "64a1b2c3d4e5f6a7b8c9d0e3"]
 */

export default router;
