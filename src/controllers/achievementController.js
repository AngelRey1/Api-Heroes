import Achievement from '../models/achievementModel.js';
import User from '../models/userModel.js';
import Item from '../models/itemModel.js';

export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const claimAchievement = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const achievement = await Achievement.findById(req.params.id);
    if (!user || !achievement) return res.status(404).json({ error: 'Not found' });
    if (user.achievements && user.achievements.includes(achievement._id)) {
      return res.status(400).json({ error: 'Achievement already claimed' });
    }
    // Marcar como reclamado
    user.achievements = user.achievements || [];
    user.achievements.push(achievement._id);
    // Entregar recompensa
    if (achievement.reward) {
      if (achievement.reward.coins) user.coins = (user.coins || 0) + achievement.reward.coins;
      if (achievement.reward.itemId) {
        const invItem = user.inventory.find(i => i.itemId.toString() === achievement.reward.itemId);
        if (invItem) invItem.quantity += 1;
        else user.inventory.push({ itemId: achievement.reward.itemId, quantity: 1 });
      }
    }
    await user.save();
    res.json({ message: 'Achievement claimed', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSecretAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const achievements = await Achievement.find({ secret: true });
    // Solo mostrar los desbloqueados
    const unlocked = achievements.filter(a => user.achievements.includes(a._id));
    res.json(unlocked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 