import Mission from '../models/missionModel.js';
import User from '../models/userModel.js';

// Plantillas de misiones diarias
const DAILY_MISSION_TEMPLATES = [
  {
    title: 'Alimentador Diario',
    description: 'Alimenta a tu mascota 3 veces hoy',
    category: 'feeding',
    actionType: 'feeding',
    goal: 3,
    difficulty: 'easy',
    coinReward: 15,
    icon: '🍖'
  },
  {
    title: 'Cuidadoso del Día',
    description: 'Cuida a tu mascota 2 veces hoy',
    category: 'care',
    actionType: 'care',
    goal: 2,
    difficulty: 'easy',
    coinReward: 20,
    icon: '💝'
  },
  {
    title: 'Comprador Diario',
    description: 'Compra 1 objeto en la tienda',
    category: 'shop',
    actionType: 'shop',
    goal: 1,
    difficulty: 'easy',
    coinReward: 25,
    icon: '🛒'
  },
  {
    title: 'Alimentador Experto',
    description: 'Alimenta a tu mascota 5 veces hoy',
    category: 'feeding',
    actionType: 'feeding',
    goal: 5,
    difficulty: 'medium',
    coinReward: 30,
    icon: '🍽️'
  },
  {
    title: 'Cuidadoso Experto',
    description: 'Cuida a tu mascota 4 veces hoy',
    category: 'care',
    actionType: 'care',
    goal: 4,
    difficulty: 'medium',
    coinReward: 35,
    icon: '💖'
  },
  {
    title: 'Comprador Frecuente',
    description: 'Compra 3 objetos en la tienda',
    category: 'shop',
    actionType: 'shop',
    goal: 3,
    difficulty: 'medium',
    coinReward: 50,
    icon: '🛍️'
  },
  {
    title: 'Alimentador Maestro',
    description: 'Alimenta a tu mascota 8 veces hoy',
    category: 'feeding',
    actionType: 'feeding',
    goal: 8,
    difficulty: 'hard',
    coinReward: 60,
    icon: '👨‍🍳'
  },
  {
    title: 'Cuidadoso Maestro',
    description: 'Cuida a tu mascota 6 veces hoy',
    category: 'care',
    actionType: 'care',
    goal: 6,
    difficulty: 'hard',
    coinReward: 70,
    icon: '👨‍⚕️'
  }
];

// Generar misiones diarias para un usuario
async function generateDailyMissions(userId) {
  try {
    // Eliminar misiones diarias existentes del usuario
    await Mission.deleteMany({ userId, type: 'daily' });
    
    // Seleccionar 3 misiones aleatorias
    const selectedMissions = [];
    const shuffled = [...DAILY_MISSION_TEMPLATES].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
      selectedMissions.push(shuffled[i]);
    }
    
    // Crear las misiones
    const missions = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    for (const template of selectedMissions) {
      const mission = new Mission({
        userId,
        type: 'daily',
        title: template.title,
        description: template.description,
        category: template.category,
        actionType: template.actionType,
        goal: template.goal,
        difficulty: template.difficulty,
        coinReward: template.coinReward,
        icon: template.icon,
        expiresAt: tomorrow
      });
      
      missions.push(await mission.save());
    }
    
    return missions;
  } catch (error) {
    console.error('Error generating daily missions:', error);
    return [];
  }
}

// Verificar y actualizar progreso de misiones
async function checkAndUpdateMissionProgress(userId, actionType, progress = 1) {
  try {
    const user = await User.findById(userId);
    if (!user) return { completed: [] };
    
    // Actualizar progreso del usuario
    const currentProgress = user.missionProgress.get(actionType) || 0;
    const newProgress = currentProgress + progress;
    user.missionProgress.set(actionType, newProgress);
    
    // Buscar misiones activas del usuario
    const activeMissions = await Mission.find({
      userId,
      type: 'daily',
      actionType,
      completed: false,
      expiresAt: { $gt: new Date() }
    });
    
    const completed = [];
    
    for (const mission of activeMissions) {
      if (newProgress >= mission.goal && !mission.completed) {
        mission.progress = mission.goal;
        mission.completed = true;
        await mission.save();
        
        completed.push({
          ...mission.toObject(),
          coinReward: mission.coinReward
        });
      } else if (!mission.completed) {
        mission.progress = Math.min(newProgress, mission.goal);
        await mission.save();
      }
    }
    
    if (completed.length > 0 || newProgress !== currentProgress) {
      await user.save();
    }
    
    return { completed, newProgress };
  } catch (error) {
    console.error('Error checking mission progress:', error);
    return { completed: [] };
  }
}

// Obtener misiones del usuario
async function getUserMissions(userId) {
  try {
    const missions = await Mission.find({
      userId,
      type: 'daily',
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: 1 });
    
    const user = await User.findById(userId);
    const progress = user?.missionProgress || new Map();
    
    return missions.map(mission => {
      const currentProgress = progress.get(mission.actionType) || 0;
      const progressPercent = Math.min((currentProgress / mission.goal) * 100, 100);
      
      return {
        ...mission.toObject(),
        currentProgress: Math.min(currentProgress, mission.goal),
        progressPercent
      };
    });
  } catch (error) {
    console.error('Error getting user missions:', error);
    return [];
  }
}

// Reclamar recompensa de misión
async function claimMissionReward(missionId, userId) {
  try {
    const mission = await Mission.findOne({ _id: missionId, userId });
    if (!mission) throw new Error('Misión no encontrada');
    if (!mission.completed) throw new Error('Misión no completada');
    if (mission.claimed) throw new Error('Recompensa ya reclamada');
    
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    
    // Otorgar recompensa
    user.coins = (user.coins || 0) + mission.coinReward;
    mission.claimed = true;
    
    await Promise.all([user.save(), mission.save()]);
    
    return {
      message: 'Recompensa reclamada',
      coins: user.coins,
      coinReward: mission.coinReward
    };
  } catch (error) {
    throw error;
  }
}

// Renovar misiones diarias automáticamente
async function renewDailyMissions() {
  try {
    const users = await User.find();
    let renewedCount = 0;
    
    for (const user of users) {
      const existingMissions = await Mission.find({
        userId: user._id,
        type: 'daily'
      });
      
      // Si no tiene misiones o todas están expiradas, generar nuevas
      const hasActiveMissions = existingMissions.some(m => m.expiresAt > new Date());
      
      if (!hasActiveMissions) {
        await generateDailyMissions(user._id);
        renewedCount++;
      }
    }
    
    console.log(`[MISSIONS] ${renewedCount} usuarios con misiones renovadas`);
    return renewedCount;
  } catch (error) {
    console.error('Error renewing daily missions:', error);
    return 0;
  }
}

export default {
  generateDailyMissions,
  checkAndUpdateMissionProgress,
  getUserMissions,
  claimMissionReward,
  renewDailyMissions
}; 