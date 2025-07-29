import express from 'express';
import { getPets, createPet, getPetById, updatePet, deletePet, renamePet, setActivePet, equipAccessory, unequipAccessory, adoptPet, returnPet, getAdoptedPets } from '../controllers/petController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

// Rutas de mascotas
router.get('/', authMiddleware, getPets);
router.post('/', [
    authMiddleware,
    check('name').not().isEmpty().withMessage('El nombre es requerido'),
    check('type').not().isEmpty().withMessage('El tipo es requerido'),
    check('superPower').not().isEmpty().withMessage('El superpoder es requerido')
], createPet);
router.get('/:petId', authMiddleware, getPetById);
router.put('/:petId', authMiddleware, updatePet);
router.delete('/:petId', authMiddleware, deletePet);
router.put('/:petId/rename', authMiddleware, renamePet);
router.put('/:petId/active', authMiddleware, setActivePet);
router.put('/:petId/equip', authMiddleware, equipAccessory);
router.put('/:petId/unequip', authMiddleware, unequipAccessory);
router.post('/:petId/adopt', authMiddleware, adoptPet);
router.post('/:petId/return', authMiddleware, returnPet);
router.get('/adopted/list', authMiddleware, getAdoptedPets);

export default router; 