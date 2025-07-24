const Mission = require('../models/missionModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ userId: req.user._id });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMissionProgress = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission || mission.userId.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Mission not found' });
    if (mission.completed) return res.status(400).json({ error: 'Mission already completed' });
    mission.progress = Math.min(mission.goal, mission.progress + (req.body.amount || 1));
    if (mission.progress >= mission.goal) mission.completed = true;
    await mission.save();
    res.json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.claimMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission || mission.userId.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Mission not found' });
    if (!mission.completed || mission.claimed) return res.status(400).json({ error: 'Mission not completed or already claimed' });
    const user = await User.findById(req.user._id);
    if (mission.reward.coins) user.coins = (user.coins || 0) + mission.reward.coins;
    // Puedes agregar más tipos de recompensa aquí
    mission.claimed = true;
    await mission.save();
    await user.save();
    // Notificación
    const notif = new Notification({
      userId: user._id,
      title: '¡Misión completada!',
      message: `Has reclamado la recompensa de la misión: ${mission.title}`,
      type: 'reward',
    });
    await notif.save();
    res.json({ message: 'Misión reclamada', coins: user.coins });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resetMissions = async (req, res) => {
  try {
    // Resetear misiones diarias/semanales (puedes mejorar la lógica según el tipo)
    await Mission.updateMany({ userId: req.user._id, type: 'daily' }, { progress: 0, completed: false, claimed: false });
    res.json({ message: 'Misiones diarias reseteadas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 