import express from 'express';
import { getUserConversations, getConversationMessages, sendMessage, markMessagesAsRead, getUnreadMessagesCount, searchMessages, deleteConversation } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', authMiddleware, getUserConversations);
router.get('/messages/:userId', authMiddleware, getConversationMessages);
router.post('/send', authMiddleware, sendMessage);
router.post('/read/:senderId', authMiddleware, markMessagesAsRead);
router.get('/unread', authMiddleware, getUnreadMessagesCount);
router.get('/search', authMiddleware, searchMessages);
router.delete('/conversation/:conversationId', authMiddleware, deleteConversation);

export default router; 