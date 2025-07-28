import Achievement from '../models/achievementModel.js';
import User from '../models/userModel.js';
import notificationService from './notificationService.js';

// Logros secretos que se desbloquean con acciones específicas
const SECRET_ACHIEVEMENTS = [
  {
    name: 'Explorador Secreto',
    description: 'Descubriste un easter egg oculto',
    icon: '🔍',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 500,
    isSecret: true,
    trigger: 'easter_egg_found'
  },
  {
    name: 'Maestro del Tiempo',
    description: 'Jugaste exactamente a las 12:00',
    icon: '⏰',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 300,
    isSecret: true,
    trigger: 'midnight_play'
  },
  {
    name: 'Lucky 7',
    description: 'Obtuviste 777 monedas',
    icon: '🍀',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 777,
    isSecret: true,
    trigger: 'lucky_777'
  },
  {
    name: 'Paciente',
    description: 'Esperaste 24 horas sin jugar',
    icon: '😴',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 1000,
    isSecret: true,
    trigger: '24h_inactive'
  },
  {
    name: 'Rápido como el Rayo',
    description: 'Completaste 5 acciones en menos de 30 segundos',
    icon: '⚡',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 400,
    isSecret: true,
    trigger: 'speed_demon'
  },
  {
    name: 'Coleccionista Obsesivo',
    description: 'Tienes 10 mascotas',
    icon: '🐾',
    type: 'secret',
    requiredProgress: 10,
    coinReward: 800,
    isSecret: true,
    trigger: 'pet_collector'
  },
  {
    name: 'Mensajero Secreto',
    description: 'Enviaste un mensaje con la palabra "secreto"',
    icon: '💬',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 250,
    isSecret: true,
    trigger: 'secret_message'
  },
  {
    name: 'Festivo',
    description: 'Jugaste en una fecha especial',
    icon: '🎉',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 600,
    isSecret: true,
    trigger: 'special_date'
  },
  {
    name: 'Músico',
    description: 'Presionaste las teclas WASD en secuencia',
    icon: '🎵',
    type: 'secret',
    requiredProgress: 1,
    coinReward: 350,
    isSecret: true,
    trigger: 'wasd_sequence'
  },
  {
    name: 'Fotógrafo',
    description: 'Hiciste clic derecho 10 veces',
    icon: '📸',
    type: 'secret',
    requiredProgress: 10,
    coinReward: 450,
    isSecret: true,
    trigger: 'right_clicks'
  }
];

// Easter eggs y sus triggers
const EASTER_EGGS = [
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  },
  {
    id: 'konami_code',
    name: 'Código Konami',
    description: '↑↑↓↓←→←→BA',
    trigger: 'konami_sequence',
    reward: 1000,
    message: '¡Código Konami activado! +1000 monedas'
  }
];

// Inicializar logros secretos
async function initializeSecretAchievements() {
  try {
    for (const achievement of SECRET_ACHIEVEMENTS) {
      const existingAchievement = await Achievement.findOne({ 
        name: achievement.name,
        type: 'secret'
      });

      if (!existingAchievement) {
        const newAchievement = new Achievement({
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          type: achievement.type,
          requiredProgress: achievement.requiredProgress,
          coinReward: achievement.coinReward,
          isSecret: achievement.isSecret,
          trigger: achievement.trigger
        });

        await newAchievement.save();
        console.log(`[SECRET] Logro secreto creado: ${achievement.name}`);
      }
    }
  } catch (error) {
    console.error('Error inicializando logros secretos:', error);
  }
}

// Verificar triggers de logros secretos
async function checkSecretTriggers(userId, trigger, data = {}) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const secretAchievements = await Achievement.find({ 
      type: 'secret',
      trigger: trigger
    });

    for (const achievement of secretAchievements) {
      // Verificar si ya está desbloqueado
      const isUnlocked = user.unlockedAchievements.some(
        ua => ua.achievementId.toString() === achievement._id.toString()
      );

      if (!isUnlocked) {
        // Verificar condiciones específicas según el trigger
        let shouldUnlock = false;

        switch (trigger) {
          case 'easter_egg_found':
            shouldUnlock = true;
            break;

          case 'midnight_play':
            const now = new Date();
            shouldUnlock = now.getHours() === 0 && now.getMinutes() === 0;
            break;

          case 'lucky_777':
            shouldUnlock = user.coins === 777;
            break;

          case '24h_inactive':
            const lastActivity = user.lastActivity || user.createdAt;
            const hoursSinceLastActivity = (Date.now() - lastActivity) / (1000 * 60 * 60);
            shouldUnlock = hoursSinceLastActivity >= 24;
            break;

          case 'speed_demon':
            // Esta lógica se maneja en el frontend
            shouldUnlock = data.actionsCompleted >= 5 && data.timeElapsed <= 30;
            break;

          case 'pet_collector':
            shouldUnlock = user.pets && user.pets.length >= 10;
            break;

          case 'secret_message':
            shouldUnlock = data.message && data.message.toLowerCase().includes('secreto');
            break;

          case 'special_date':
            const today = new Date();
            const specialDates = [
              { month: 11, day: 25 }, // Navidad
              { month: 0, day: 1 },   // Año nuevo
              { month: 9, day: 31 },  // Halloween
              { month: 3, day: 1 }    // Día de los inocentes
            ];
            shouldUnlock = specialDates.some(date => 
              today.getMonth() === date.month && today.getDate() === date.day
            );
            break;

          case 'wasd_sequence':
            shouldUnlock = data.sequence === 'wasd';
            break;

          case 'right_clicks':
            shouldUnlock = data.rightClicks >= 10;
            break;

          default:
            shouldUnlock = false;
        }

        if (shouldUnlock) {
          await unlockSecretAchievement(user, achievement);
        }
      }
    }
  } catch (error) {
    console.error('Error verificando triggers secretos:', error);
  }
}

// Desbloquear logro secreto
async function unlockSecretAchievement(user, achievement) {
  try {
    // Agregar monedas
    user.coins += achievement.coinReward;

    // Agregar a logros desbloqueados
    user.unlockedAchievements.push({
      achievementId: achievement._id,
      unlockedAt: new Date(),
      progress: achievement.requiredProgress
    });

    // Actualizar progreso
    if (!user.achievementProgress) {
      user.achievementProgress = new Map();
    }
    user.achievementProgress.set(achievement._id.toString(), achievement.requiredProgress);

    await user.save();

    // Enviar notificación
    await notificationService.achievementUnlocked(user._id, achievement);

    console.log(`[SECRET] Logro secreto desbloqueado: ${achievement.name} para usuario ${user.username}`);

    return {
      achievement,
      coinsEarned: achievement.coinReward,
      message: `¡Logro secreto desbloqueado: ${achievement.name}!`
    };
  } catch (error) {
    console.error('Error desbloqueando logro secreto:', error);
    throw error;
  }
}

// Obtener logros secretos del usuario
async function getUserSecretAchievements(userId) {
  try {
    const user = await User.findById(userId).populate('unlockedAchievements.achievementId');
    const secretAchievements = await Achievement.find({ type: 'secret' });

    return secretAchievements.map(achievement => {
      const unlocked = user.unlockedAchievements.find(
        ua => ua.achievementId._id.toString() === achievement._id.toString()
      );

      return {
        ...achievement.toObject(),
        isUnlocked: !!unlocked,
        unlockedAt: unlocked ? unlocked.unlockedAt : null,
        progress: unlocked ? achievement.requiredProgress : 0
      };
    });
  } catch (error) {
    console.error('Error obteniendo logros secretos:', error);
    throw error;
  }
}

// Verificar easter eggs
async function checkEasterEgg(userId, eggId, data = {}) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const egg = EASTER_EGGS.find(e => e.id === eggId);
    if (!egg) return null;

    // Verificar si ya se activó hoy
    const today = new Date().toDateString();
    const activatedToday = user.easterEggsActivated && 
      user.easterEggsActivated[eggId] === today;

    if (activatedToday) {
      return { message: 'Este easter egg ya fue activado hoy' };
    }

    // Activar easter egg
    if (!user.easterEggsActivated) {
      user.easterEggsActivated = {};
    }
    user.easterEggsActivated[eggId] = today;
    user.coins += egg.reward;

    await user.save();

    // Enviar notificación
    await notificationService.createNotification(
      userId,
      'easter_egg',
      '¡Easter Egg Encontrado!',
      egg.message,
      '🥚',
      'high'
    );

    console.log(`[EASTER EGG] ${egg.name} activado por ${user.username}`);

    return {
      egg,
      coinsEarned: egg.reward,
      message: egg.message
    };
  } catch (error) {
    console.error('Error activando easter egg:', error);
    throw error;
  }
}

// Obtener estadísticas de easter eggs
async function getEasterEggStats(userId) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.easterEggsActivated) {
      return { totalFound: 0, eggs: [] };
    }

    const eggs = Object.keys(user.easterEggsActivated).map(eggId => {
      const egg = EASTER_EGGS.find(e => e.id === eggId);
      return {
        id: eggId,
        name: egg ? egg.name : 'Desconocido',
        activatedAt: user.easterEggsActivated[eggId]
      };
    });

    return {
      totalFound: eggs.length,
      eggs
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de easter eggs:', error);
    throw error;
  }
}

// Generar easter egg aleatorio
async function generateRandomEasterEgg(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    // 5% de probabilidad de generar un easter egg
    if (Math.random() > 0.05) return null;

    const randomEgg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
    
    return await checkEasterEgg(userId, randomEgg.id);
  } catch (error) {
    console.error('Error generando easter egg aleatorio:', error);
    return null;
  }
}

export default {
  initializeSecretAchievements,
  checkSecretTriggers,
  unlockSecretAchievement,
  getUserSecretAchievements,
  checkEasterEgg,
  getEasterEggStats,
  generateRandomEasterEgg,
  SECRET_ACHIEVEMENTS,
  EASTER_EGGS
}; 