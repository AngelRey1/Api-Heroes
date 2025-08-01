import express from 'express';
import { getProfile, updateProfile, updateBackground } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.put('/background', authMiddleware, updateBackground);

/**
 * Actualizar monedas del usuario
 */
router.put('/:userId/coins', authMiddleware, async (req, res) => {
  try {
    const { coins } = req.body;
    const { userId } = req.params;
    
    // Verificar que el usuario solo puede actualizar sus propias monedas
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'No puedes actualizar las monedas de otro usuario' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { coins: Math.max(0, coins) }, // No permitir monedas negativas
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ 
      message: 'Monedas actualizadas correctamente',
      coins: user.coins 
    });
  } catch (error) {
    console.error('Error actualizando monedas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router; 