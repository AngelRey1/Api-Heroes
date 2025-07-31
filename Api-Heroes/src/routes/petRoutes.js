import express from 'express';
import { getPets, createPet, getPetById, updatePet, deletePet, renamePet, setActivePet, equipAccessory, unequipAccessory, adoptPet, returnPet, getAdoptedPets } from '../controllers/petController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

// Rutas de mascotas
router.get('/', authMiddleware, getPets);
router.post('/', authMiddleware, createPet);
router.get('/:id', authMiddleware, getPetById);
router.put('/:id', authMiddleware, updatePet);
router.delete('/:id', authMiddleware, deletePet);
router.put('/:id/rename', authMiddleware, renamePet);
router.put('/:id/active', authMiddleware, setActivePet);
router.put('/:id/equip', authMiddleware, equipAccessory);
router.put('/:id/unequip', authMiddleware, unequipAccessory);
router.post('/:id/adopt', authMiddleware, adoptPet);
router.post('/:id/return', authMiddleware, returnPet);
router.get('/adopted/list', authMiddleware, getAdoptedPets);

export default router; 