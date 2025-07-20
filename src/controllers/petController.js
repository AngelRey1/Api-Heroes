import express from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from '../middleware/authMiddleware.js';
import PetService from '../services/petService.js';
import { ValidationError, AuthorizationError, NotFoundError } from '../utils/errors.js';
import { toBasicPet } from '../services/petService.js';

const router = express.Router();
const petService = new PetService();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     tags:
 *       - Mascotas
 *     summary: Lista todas las mascotas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const pets = await petService.getAllPets(req.user._id);
        res.json(pets);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets:
 *   post:
 *     tags:
 *       - Mascotas
 *     summary: Agrega una nueva mascota
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
 *               - type
 *               - superPower
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la mascota
 *                 example: "Firulais"
 *               type:
 *                 type: string
 *                 description: Tipo de mascota
 *                 example: "Perro"
 *               superPower:
 *                 type: string
 *                 description: Superpoder especial de la mascota
 *                 example: "Volar"
 *     responses:
 *       201:
 *         description: Mascota creada
 */
router.post("/", [
    authMiddleware,
    check('name').not().isEmpty().withMessage('El nombre es requerido'),
    check('type').not().isEmpty().withMessage('El tipo es requerido'),
    check('superPower').not().isEmpty().withMessage('El superpoder es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error : errors.array() });
    }
    try {
        console.log('Body recibido:', req.body); // Log para depuración
        const { name, type, superPower } = req.body;
        const newPet = await petService.createPet({ name, type, superPower }, req.user._id);
        res.status(201).json(newPet.toJSON ? newPet.toJSON() : newPet);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{petId}:
 *   get:
 *     tags:
 *       - Mascotas
 *     summary: Obtener detalles de una mascota
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
 *         description: Detalles de la mascota
 */
router.get('/:petId', authMiddleware, async (req, res) => {
    try {
        const pet = await petService.getPetById(req.params.petId, req.user._id);
        res.json(pet);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{petId}:
 *   put:
 *     tags:
 *       - Mascotas
 *     summary: Actualizar una mascota
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la mascota
 *                 example: "Firulais"
 *               type:
 *                 type: string
 *                 description: Tipo de mascota
 *                 example: "Perro"
 *               superPower:
 *                 type: string
 *                 description: Superpoder especial de la mascota
 *                 example: "Volar"
 *     responses:
 *       200:
 *         description: Mascota actualizada
 */
router.put('/:petId', authMiddleware, async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.petId, req.body, req.user._id);
        res.json(updatedPet.toJSON ? updatedPet.toJSON() : updatedPet);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{petId}:
 *   delete:
 *     tags:
 *       - Mascotas
 *     summary: Eliminar una mascota
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
 *         description: Mascota eliminada
 */
router.delete('/:petId', authMiddleware, async (req, res) => {
    try {
        const result = await petService.deletePet(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{petId}/adopt:
 *   post:
 *     tags:
 *       - Mascotas
 *     summary: Adoptar una mascota
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
 *               - heroId
 *               - reason
 *             properties:
 *               heroId:
 *                 type: string
 *                 description: ID del héroe que adopta la mascota
 *                 example: "6878f41bf21b1c216b8840f5"
 *               reason:
 *                 type: string
 *                 description: Motivo de adopción
 *                 example: "Necesita compañía"
 *               notes:
 *                 type: string
 *                 description: Notas adicionales
 *                 example: "Mascota muy cariñosa"
 *     responses:
 *       200:
 *         description: Mascota adoptada
 */
router.post('/:petId/adopt', authMiddleware, async (req, res) => {
    try {
        const { heroId, reason, notes } = req.body;
        const result = await petService.adoptPet(req.params.petId, heroId, reason, notes, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.message && error.message.includes('ya fue adoptada')) {
            return res.status(409).json({ error: error.message });
        }
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
});
/**
 * @swagger
 * /api/pets/{petId}/return:
 *   post:
 *     tags:
 *       - Mascotas
 *     summary: Devolver una mascota
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
 *               notes:
 *                 type: string
 *                 description: Notas sobre la devolución
 *                 example: "El héroe ya no puede cuidarla"
 *     responses:
 *       200:
 *         description: Mascota devuelta
 */
router.post('/:petId/return', authMiddleware, async (req, res) => {
    try {
        const { notes } = req.body || {};
        const result = await petService.returnPet(req.params.petId, notes, req.user._id);
        res.json(result);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1b2c3d4e5f6a7b8c9d0e2"
 *           description: ID único de MongoDB
 *         id_corto:
 *           type: string
 *           example: "64a1b2c3"
 *           description: ID corto para mostrar o copiar fácilmente
 *         name:
 *           type: string
 *           example: "Krypto"
 *           description: Nombre de la mascota
 *         type:
 *           type: string
 *           example: "Perro"
 *           description: Tipo de mascota (perro, gato, etc.)
 *         superPower:
 *           type: string
 *           example: "Vuelo y super fuerza"
 *           description: Superpoder especial de la mascota
 *         adoptedBy:
 *           type: string
 *           example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *           description: ID del héroe que adoptó la mascota
 *         status:
 *           type: string
 *           example: "available"
 *           description: Estado de la mascota (available, adopted, returned, dead)
 *         health:
 *           type: integer
 *           example: 100
 *           description: Nivel de salud (0-100)
 *         happiness:
 *           type: integer
 *           example: 100
 *           description: Nivel de felicidad (0-100)
 *         personality:
 *           type: string
 *           example: "juguetón"
 *           description: Personalidad de la mascota
 *         diseases:
 *           type: array
 *           items:
 *             type: string
 *           example: ["gripe"]
 *           description: Enfermedades activas
 *         lastCare:
 *           type: string
 *           example: "2024-05-01T12:00:00.000Z"
 *           description: Fecha del último cuidado
 *       example:
 *         _id: "64a1b2c3d4e5f6a7b8c9d0e2"
 *         id_corto: "64a1b2c3"
 *         name: "Krypto"
 *         type: "Perro"
 *         superPower: "Vuelo y super fuerza"
 *         adoptedBy: "64a1b2c3d4e5f6a7b8c9d0e1"
 *         status: "available"
 *         health: 100
 *         happiness: 100
 *         personality: "juguetón"
 *         diseases: ["gripe"]
 *         lastCare: "2024-05-01T12:00:00.000Z"
 */

// Utilidad para mapear errores a códigos HTTP
function mapErrorToStatus(error) {
    if (error instanceof ValidationError) return 400;
    if (error instanceof AuthorizationError) return 403;
    if (error instanceof NotFoundError) return 404;
    return 500;
}

export default router; 