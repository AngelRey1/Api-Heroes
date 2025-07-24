import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getPets, createPet, renamePet, deletePet, setActivePet, equipAccessory, unequipAccessory } from '../controllers/petController.js';

const router = express.Router();

router.get('/', authMiddleware, getPets);
router.post('/', authMiddleware, createPet);
router.put('/:id/rename', authMiddleware, renamePet);
router.delete('/:id', authMiddleware, deletePet);
router.post('/:id/active', authMiddleware, setActivePet);
router.post('/:id/equip', authMiddleware, equipAccessory);
router.post('/:id/unequip', authMiddleware, unequipAccessory);

export default router; 