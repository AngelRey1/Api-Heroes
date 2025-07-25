import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

export const getActiveEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Notification.find({ type: 'event', $or: [ { eventEnd: null }, { eventEnd: { $gt: now } } ] }).sort({ eventStart: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const claimDailyReward = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date();
    const lastClaim = user.lastDailyReward || new Date(0);
    if (lastClaim.toDateString() === today.toDateString()) {
      return res.status(400).json({ error: 'Ya reclamaste la recompensa diaria hoy.' });
    }
    user.coins = (user.coins || 0) + 100;
    user.lastDailyReward = today;
    await user.save();
    // Crear notificación
    const notif = new Notification({
      userId: user._id,
      title: '¡Recompensa diaria!',
      message: 'Has recibido 100 monedas por tu login diario.',
      type: 'reward',
    });
    await notif.save();
    res.json({ message: 'Recompensa diaria reclamada', coins: user.coins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 