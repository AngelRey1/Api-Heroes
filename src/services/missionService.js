import Mission from '../models/missionModel.js';
import User from '../models/userModel.js';

class MissionService {
  /**
   * Verificar y actualizar progreso de misiones
   */
  async checkAndUpdateMissionProgress(userId, actionType, amount = 1) {
    try {
      console.log(`MissionService - Actualizando progreso: ${actionType} +${amount} para usuario ${userId}`);
      
      const user = await User.findById(userId);
      if (!user) {
        console.log('MissionService - Usuario no encontrado');
        return { completed: [] };
      }

      // Obtener misiones del usuario
      const userMissions = await Mission.find({ userId: user._id });
      console.log(`MissionService - Misiones encontradas: ${userMissions.length}`);

      const completed = [];

      for (const mission of userMissions) {
        // Verificar si la misión corresponde a la acción
        if (this.matchesAction(mission, actionType)) {
          console.log(`MissionService - Actualizando misión: ${mission.title} (${mission.progress}/${mission.goal})`);
          
          const newProgress = mission.progress + amount;
          mission.progress = newProgress;
          
          if (!mission.completed && newProgress >= mission.goal) {
            mission.completed = true;
            mission.progress = mission.goal;
            completed.push(mission);
            console.log(`MissionService - Misión completada: ${mission.title}`);
          }
          
          await mission.save();
        }
      }

      console.log(`MissionService - Misiones completadas: ${completed.length}`);
      return { completed };
    } catch (error) {
      console.error('MissionService - Error actualizando misiones:', error);
      return { completed: [] };
    }
  }

  /**
   * Verificar si una misión corresponde a una acción
   */
  matchesAction(mission, actionType) {
    const actionMap = {
      'feeding': ['alimentar', 'feed', 'comida'],
      'playing': ['jugar', 'play', 'diversión'],
      'cleaning': ['limpiar', 'clean', 'baño'],
      'sleeping': ['dormir', 'sleep', 'descanso']
    };

    const keywords = actionMap[actionType] || [];
    const missionText = `${mission.title} ${mission.description}`.toLowerCase();
    
    return keywords.some(keyword => missionText.includes(keyword));
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