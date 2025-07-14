import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import Hero from "../models/heroModel.js";
import petRepository from "../repositories/petRepository.js";

const router = express.Router();

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     tags:
 *       - Superhéroes
 *     summary: Obtiene todos los héroes
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
router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        const pets = await petRepository.getPets();
        // Mapear los ids de mascotas a objetos {id, name}
        const heroesWithPetNames = heroes.map(hero => ({
            ...hero,
            pets: (hero.pets || []).map(pid => {
                const pet = pets.find(p => p.id === (typeof pid === 'object' ? pid.id : pid));
                return pet ? { id: pet.id, name: pet.name } : { id: pid };
            })
        }));
        res.json(heroesWithPetNames);
    } catch (error) {
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hero'
 *     responses:
 *       201:
 *         description: Héroe creado
 *       400:
 *         description: Error de validación
 */
router.post("/heroes",
    [
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
            const newHero = new Hero(null, name, alias, city, team);
            const addedHero = await heroService.addHero(newHero);

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
 */
router.get('/heroes/city/:city', async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city);
        res.json(heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/heroes/{id}/enfrentar:
 *   post:
 *     tags:
 *       - Superhéroes
 *     summary: Enfrenta a un héroe con un villano
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               villain:
 *                 type: string
 *                 example: Joker
 *     responses:
 *       200:
 *         description: Mensaje de enfrentamiento
 *       404:
 *         description: Héroe no encontrado
 */
router.post('/heroes/:id/enfrentar', async (req, res) => {
    try {
        const result = await heroService.faceVillain(req.params.id, req.body.villain);
        res.json({ message: result });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/heroes/{id}/pets:
 *   get:
 *     tags:
 *       - Superhéroes
 *     summary: Lista las mascotas adoptadas por un héroe
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *       404:
 *         description: Héroe no encontrado
 */
router.get('/heroes/:id/pets', async (req, res) => {
    try {
        const pets = await heroService.getHeroPets(req.params.id);
        res.json(pets);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes/{id}:
 *   put:
 *     tags:
 *       - Superhéroes
 *     summary: Actualiza un héroe por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hero'
 *     responses:
 *       200:
 *         description: Héroe actualizado
 *       404:
 *         description: Héroe no encontrado
 */
router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/heroes/{id}:
 *   delete:
 *     summary: Elimina un héroe por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Héroe eliminado
 *       404:
 *         description: Héroe no encontrado
 */
router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id);
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
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Roberto Gómez Bolaños
 *         alias:
 *           type: string
 *           example: Chapulin Colorado
 *         city:
 *           type: string
 *           example: CDMX
 *         team:
 *           type: string
 *           example: Independient
 */

export default router;
