import express from "express";
import petService from "../services/petService.js";

const router = express.Router();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     tags:
 *       - Mascotas
 *     summary: Lista todas las mascotas
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
router.get("/", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets:
 *   post:
 *     tags:
 *       - Mascotas
 *     summary: Agrega una mascota (puedes especificar el id)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID opcional de la mascota
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               superPower:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota creada
 *       400:
 *         description: Error de validación
 */
router.post("/", async (req, res) => {
    try {
        // No permitir adoptedBy en la creación
        const { id, name, type, superPower } = req.body;
        const newPet = await petService.addPet({ id, name, type, superPower });
        res.status(201).json(newPet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     tags:
 *       - Mascotas
 *     summary: Elimina una mascota por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await petService.deletePet(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}/adoptedBy:
 *   get:
 *     tags:
 *       - Mascotas
 *     summary: Ver quién adoptó la mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Héroe adoptante
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/:id/adoptedBy', async (req, res) => {
    try {
        const pet = await petService.getPetById(req.params.id);
        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }
        // Buscar el héroe por id
        const heroService = await import('../services/heroService.js');
        const heroes = await heroService.default.getAllHeroes();
        const hero = heroes.find(h => h.id === parseInt(pet.adoptedBy));
        if (!hero) {
            return res.status(404).json({ error: 'Héroe adoptante no encontrado' });
        }
        res.json({ id: hero.id, name: hero.name, alias: hero.alias });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}/adopt:
 *   post:
 *     tags:
 *       - Mascotas
 *     summary: Un héroe adopta una mascota (registro realista)
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
 *               heroId:
 *                 type: integer
 *                 description: ID del héroe que adopta
 *               reason:
 *                 type: string
 *                 description: Motivo de adopción
 *               notes:
 *                 type: string
 *                 description: Observaciones
 *     responses:
 *       200:
 *         description: Mascota adoptada
 *       400:
 *         description: Error de validación
 */
router.post('/:id/adopt', async (req, res) => {
    try {
        const { heroId, reason, notes } = req.body;
        const result = await petService.adoptPet(req.params.id, heroId, reason, notes);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * @swagger
 * /api/pets/{id}/return:
 *   post:
 *     tags:
 *       - Mascotas
 *     summary: Devolver una mascota adoptada
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
 *               notes:
 *                 type: string
 *                 description: Motivo o notas de la devolución
 *     responses:
 *       200:
 *         description: Mascota devuelta
 *       400:
 *         description: Error
 */
router.post('/:id/return', async (req, res) => {
    try {
        const { notes } = req.body || {};
        const result = await petService.returnPet(req.params.id, notes);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtener detalles de una mascota (incluye historial de adopciones)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Detalles de la mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/:id', async (req, res) => {
    try {
        const pet = await petService.getPetById(req.params.id);
        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Actualiza los datos de una mascota (puedes cambiar el id)
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
 *               id:
 *                 type: integer
 *                 description: Nuevo id de la mascota (opcional)
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               superPower:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.id, req.body);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/pets/adopted:
 *   get:
 *     summary: Lista todas las mascotas adoptadas
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas
 */
router.get('/adopted', async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        const adopted = pets.filter(pet => pet.adoptedBy);
        res.json(adopted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Krypto
 *         type:
 *           type: string
 *           example: Perro
 *         superPower:
 *           type: string
 *           example: Vuelo y super fuerza
 *         adoptedBy:
 *           type: integer
 *           example: 1
 *           description: ID del héroe que adoptó la mascota
 */

export default router; 