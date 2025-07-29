import express from 'express';
import { searchUsers, sendFriendRequest, respondToFriendRequest, getFriendsList, getFriendRequests, getFriendProfile, removeFriend, sendGift, getReceivedGifts, claimGift } from '../controllers/friendController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', authMiddleware, searchUsers);
router.post('/request', authMiddleware, sendFriendRequest);
router.post('/request/:requestId/respond', authMiddleware, respondToFriendRequest);
router.get('/list', authMiddleware, getFriendsList);
router.get('/requests', authMiddleware, getFriendRequests);
router.get('/:friendId/profile', authMiddleware, getFriendProfile);
router.delete('/:friendId/remove', authMiddleware, removeFriend);
router.post('/gift', authMiddleware, sendGift);
router.get('/gifts', authMiddleware, getReceivedGifts);
router.post('/gifts/:giftId/claim', authMiddleware, claimGift);

export default router; 