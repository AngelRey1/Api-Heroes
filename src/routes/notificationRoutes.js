import express from 'express';
import { getNotifications, createNotification, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/', authMiddleware, createNotification);
router.post('/:id/read', authMiddleware, markAsRead);
router.delete('/:id', authMiddleware, deleteNotification);

export default router; 