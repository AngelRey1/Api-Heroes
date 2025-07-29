import express from 'express';
import { getProfile, updateProfile, updateBackground } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.put('/background', authMiddleware, updateBackground);

export default router; 