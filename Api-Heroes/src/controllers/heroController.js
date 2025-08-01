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
        console.error('Error obteniendo héroes:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Agrega un nuevo héroe
 */
export const addHero = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log('Errores de validación:', errors.array());
            return res.status(400).json({ 
                error: 'Datos de validación incorrectos',
                details: errors.array() 
            });
        }

        const { name, alias, city, team, superPower, type, color, personality, accessories, avatar } = req.body;
        
        // Validación adicional en el controlador
        if (!name || !alias) {
            return res.status(400).json({ 
                error: 'Nombre y alias son campos requeridos',
                details: [
                    { field: 'name', message: !name ? 'El nombre es requerido' : null },
                    { field: 'alias', message: !alias ? 'El alias es requerido' : null }
                ].filter(item => item.message)
            });
        }

        const heroData = { 
            name: name.trim(), 
            alias: alias.trim(), 
            city: city ? city.trim() : undefined, 
            team: team ? team.trim() : undefined, 
            superPower: superPower ? superPower.trim() : undefined, 
            type: type ? type.trim() : undefined, 
            color: color || '#3498db', 
            personality: personality ? personality.trim() : undefined, 
            accessories: accessories || [], 
            avatar: avatar || '/assets/hero.png',
            owner: req.user._id 
        };

        console.log('Creando héroe con datos:', heroData);
        
        const addedHero = await heroService.addHero(heroData);
        console.log('Héroe creado exitosamente:', addedHero._id);
        
        res.status(201).json(addedHero);
    } catch (error) {
        console.error('Error creando héroe:', error);
        
        // Manejar errores específicos de MongoDB
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: 'Ya existe un héroe con ese nombre o alias',
                details: 'El nombre o alias debe ser único'
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Error de validación en los datos del héroe',
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ 
            error: 'Error interno del servidor al crear el héroe',
            details: error.message 
        });
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
        console.error('Error obteniendo héroe:', error);
        if (error.status === 403) return res.status(403).json({ error: error.message });
        if (error.status === 404) return res.status(404).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Actualiza un héroe
 */
export const updateHero = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log('Errores de validación en actualización:', errors.array());
            return res.status(400).json({ 
                error: 'Datos de validación incorrectos',
                details: errors.array() 
            });
        }
        
        const { name, alias, city, team, superPower, avatar, color } = req.body;
        
        // Limpiar y validar datos
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (alias) updateData.alias = alias.trim();
        if (city) updateData.city = city.trim();
        if (team) updateData.team = team.trim();
        if (superPower) updateData.superPower = superPower.trim();
        if (avatar) updateData.avatar = avatar.trim();
        if (color) updateData.color = color;
        
        console.log('Actualizando héroe con datos:', updateData);
        
        const updatedHero = await heroService.updateHero(req.params.id, updateData, req.user._id);
        res.json(updatedHero);
    } catch (error) {
        console.error('Error actualizando héroe:', error);
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
        console.error('Error eliminando héroe:', error);
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
