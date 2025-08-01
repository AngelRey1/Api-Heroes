import { check, validationResult } from "express-validator";
import PetService from '../services/petService.js';
import { ValidationError, AuthorizationError, NotFoundError } from '../utils/errors.js';
import Pet from '../models/petModel.js';
import User from '../models/userModel.js';

const petService = new PetService();

/**
 * Lista todas las mascotas
 */
export const getPets = async (req, res) => {
    try {
        const pets = await petService.getAllPets(req.user._id);
        res.json(pets);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Agrega una nueva mascota
 */
export const createPet = async (req, res) => {
    try {
        console.log('Body recibido:', req.body); // Log para depuración
        const { name, type, petType, superPower, color, personality, accessories } = req.body;
        
        // Validación básica
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }
        
        const newPet = await petService.createPet({ 
            name, 
            type, 
            petType, 
            superPower, 
            color, 
            personality, 
            accessories 
        }, req.user._id);
        res.status(201).json(newPet.toJSON ? newPet.toJSON() : newPet);
    } catch (error) {
        console.error('Error creando mascota:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Obtener detalles de una mascota
 */
export const getPetById = async (req, res) => {
    try {
        const pet = await petService.getPetById(req.params.id, req.user._id);
        res.json(pet);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Actualizar mascota
 */
export const updatePet = async (req, res) => {
    try {
        const { name, type, superPower } = req.body;
        const updatedPet = await petService.updatePet(req.params.id, { name, type, superPower }, req.user._id);
        res.json(updatedPet);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Eliminar mascota
 */
export const deletePet = async (req, res) => {
    try {
        await petService.deletePet(req.params.id, req.user._id);
        res.json({ message: 'Mascota eliminada exitosamente' });
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Renombrar mascota
 */
export const renamePet = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }
        
        const pet = await petService.renamePet(req.params.id, name, req.user._id);
        res.json(pet);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Establecer mascota activa
 */
export const setActivePet = async (req, res) => {
    try {
        const result = await petService.setActivePet(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Equipar accesorio
 */
export const equipAccessory = async (req, res) => {
    try {
        const { accessoryId } = req.body;
        const result = await petService.equipAccessory(req.params.petId, accessoryId, req.user._id);
        res.json(result);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Desequipar accesorio
 */
export const unequipAccessory = async (req, res) => {
    try {
        const { accessoryId } = req.body;
        const result = await petService.unequipAccessory(req.params.petId, accessoryId, req.user._id);
        res.json(result);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Adoptar mascota
 */
export const adoptPet = async (req, res) => {
    try {
        const result = await petService.adoptPet(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Devolver mascota
 */
export const returnPet = async (req, res) => {
    try {
        const result = await petService.returnPet(req.params.petId, req.user._id);
        res.json(result);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

/**
 * Obtener mascotas adoptadas
 */
export const getAdoptedPets = async (req, res) => {
    try {
        const pets = await petService.getAdoptedPetsByUser(req.user._id);
        res.json(pets);
    } catch (error) {
        const status = mapErrorToStatus(error);
        res.status(status).json({ error: error.message });
    }
};

function mapErrorToStatus(error) {
    if (error instanceof ValidationError) return 400;
    if (error instanceof AuthorizationError) return 403;
    if (error instanceof NotFoundError) return 404;
    return 500;
} 