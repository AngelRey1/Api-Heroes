import { check, validationResult } from 'express-validator';
import HeroService from '../services/heroService.js';
import Hero from '../models/heroModel.js';
import petRepository from '../repositories/petRepository.js';
import { toBasicPet } from '../services/petService.js';

const heroService = new HeroService();

/**
 * Obtiene todos los héroes
 */
export const getAllHeroes = async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes(req.user._id);
        res.json(heroes);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Agrega un nuevo héroe
 */
export const addHero = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error : errors.array() });
    }
    try {
        const { name, alias, city, team, type, color, personality, accessories, avatar } = req.body;
        const addedHero = await heroService.addHero({ 
            name, 
            alias, 
            city, 
            team, 
            type, 
            color, 
            personality, 
            accessories, 
            avatar,
            owner: req.user._id 
        });
        res.status(201).json(addedHero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtiene un héroe por ID
 */
export const getHeroById = async (req, res) => {
    try {
        const hero = await heroService.getHeroById(req.params.id, req.user._id);
        res.json(hero);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Actualiza un héroe
 */
export const updateHero = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error : errors.array() });
    }
    try {
        const { name, alias, city, team, avatar, color } = req.body;
        const updatedHero = await heroService.updateHero(req.params.id, { name, alias, city, team, avatar, color }, req.user._id);
        res.json(updatedHero);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Elimina un héroe
 */
export const deleteHero = async (req, res) => {
    try {
        await heroService.deleteHero(req.params.id, req.user._id);
        res.json({ message: 'Héroe eliminado exitosamente' });
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Busca héroes por ciudad
 */
export const findHeroesByCity = async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city);
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Enfrenta héroe contra villano
 */
export const faceVillain = async (req, res) => {
    try {
        const { villainName, villainPower } = req.body;
        const result = await heroService.faceVillain(req.params.id, villainName, villainPower, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtiene mascotas del héroe
 */
export const getHeroPets = async (req, res) => {
    try {
        const pets = await heroService.getHeroPets(req.params.id, req.user._id);
        res.json(pets);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Personalizar héroe
 */
export const customizeHero = async (req, res) => {
    try {
        const { name, alias, city, team, avatar, color } = req.body;
        const result = await heroService.customizeHero(req.params.id, { name, alias, city, team, avatar, color }, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};
