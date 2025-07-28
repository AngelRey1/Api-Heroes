import Mission from '../models/missionModel.js';
import User from '../models/userModel.js';

class MissionService {
  /**
   * Verificar y actualizar progreso de misiones
   */
  async checkAndUpdateMissionProgress(userId, actionType, amount = 1) {
    const user = await User.findById(userId);
    if (!user) return { completed: [] };

    const currentProgress = user.missionProgress.get(actionType) || 0;
    const newProgress = currentProgress + amount;
    user.missionProgress.set(actionType, newProgress);

    const completed = [];
    const userMissions = await Mission.find({ userId: user._id });

    for (const mission of userMissions) {
      if (!mission.completed && mission.progress + amount >= mission.goal) {
        mission.completed = true;
        mission.progress = mission.goal;
        completed.push(mission);
      } else if (!mission.completed) {
        mission.progress += amount;
      }
      await mission.save();
    }

    await user.save();
    return { completed };
  }

  /**
   * Renovar misiones diarias
   */
  async renewDailyMissions() {
    const users = await User.find();
    let renewedCount = 0;

    for (const user of users) {
      // Eliminar misiones diarias existentes
      await Mission.deleteMany({ userId: user._id, type: 'daily' });

      // Crear nuevas misiones diarias
      const dailyMissions = [
        {
          userId: user._id,
          type: 'daily',
          title: 'Alimenta a tu mascota',
          description: 'Dale de comer a tu mascota',
          progress: 0,
          goal: 1,
          completed: false,
          claimed: false,
          reward: { coins: 10 }
        },
        {
          userId: user._id,
          type: 'daily',
          title: 'Juega con tu mascota',
          description: 'Haz feliz a tu mascota',
          progress: 0,
          goal: 1,
          completed: false,
          claimed: false,
          reward: { coins: 10 }
        }
      ];

      await Mission.insertMany(dailyMissions);
      renewedCount++;
    }

    return renewedCount;
  }

  /**
   * Obtener misiones del usuario
   */
  async getUserMissions(userId) {
    return await Mission.find({ userId });
  }

  /**
   * Reclamar recompensa de misión
   */
  async claimMissionReward(userId, missionId) {
    const user = await User.findById(userId);
    const mission = await Mission.findOne({ _id: missionId, userId: user._id });

    if (!mission) {
      throw new Error('Misión no encontrada');
    }

    if (!mission.completed) {
      throw new Error('Misión no completada');
    }

    if (mission.claimed) {
      throw new Error('Recompensa ya reclamada');
    }

    // Otorgar recompensa
    user.coins += mission.reward.coins;
    mission.claimed = true;

    await user.save();
    await mission.save();

    return { coins: user.coins, mission };
  }
}

export default new MissionService(); 