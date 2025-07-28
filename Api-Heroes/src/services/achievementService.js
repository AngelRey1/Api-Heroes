import Achievement from '../models/achievementModel.js';
import User from '../models/userModel.js';

class AchievementService {
  /**
   * Inicializar logros por defecto
   */
  async initializeAchievements() {
    const count = await Achievement.countDocuments();
    if (count === 0) {
      await Achievement.insertMany([
        { name: 'Primer mascota', description: 'Adopta tu primera mascota', criteria: 'adopt_pet', reward: { coins: 50 } },
        { name: 'Cuida bien', description: 'Alcanza 100 de salud en una mascota', criteria: 'pet_health_100', reward: { coins: 100 } },
        { name: 'Jugador activo', description: 'Juega 7 días seguidos', criteria: 'login_streak_7', reward: { coins: 200 } },
        { name: 'Alimentador experto', description: 'Alimenta 10 veces', criteria: 'feed_10', reward: { coins: 75 } },
        { name: 'Jugador feliz', description: 'Alcanza 100 de felicidad', criteria: 'pet_happiness_100', reward: { coins: 100 } }
      ]);
    }
  }

  /**
   * Verificar logros de alimentación
   */
  async checkFeedingAchievements(userId) {
    const user = await User.findById(userId).populate('pets');
    const unlocked = [];

    // Logro: Primer mascota
    if (user.pets && user.pets.length > 0) {
      const achievement = await Achievement.findOne({ criteria: 'adopt_pet' });
      if (achievement && !user.unlockedAchievements.some(u => u.achievement.toString() === achievement._id.toString())) {
        user.coins += achievement.reward.coins;
        user.unlockedAchievements.push({ achievement: achievement._id });
        unlocked.push(achievement);
      }
    }

    // Logro: Alimentador experto
    const feedCount = user.achievementProgress.get('feeding') || 0;
    if (feedCount >= 10) {
      const achievement = await Achievement.findOne({ criteria: 'feed_10' });
      if (achievement && !user.unlockedAchievements.some(u => u.achievement.toString() === achievement._id.toString())) {
        user.coins += achievement.reward.coins;
        user.unlockedAchievements.push({ achievement: achievement._id });
        unlocked.push(achievement);
      }
    }

    await user.save();
    return { unlocked };
  }

  /**
   * Verificar logros de juego
   */
  async checkPlayingAchievements(userId) {
    const user = await User.findById(userId).populate('pets');
    const unlocked = [];

    // Logro: Jugador feliz
    const happyPet = user.pets.find(pet => pet.happiness >= 100);
    if (happyPet) {
      const achievement = await Achievement.findOne({ criteria: 'pet_happiness_100' });
      if (achievement && !user.unlockedAchievements.some(u => u.achievement.toString() === achievement._id.toString())) {
        user.coins += achievement.reward.coins;
        user.unlockedAchievements.push({ achievement: achievement._id });
        unlocked.push(achievement);
      }
    }

    await user.save();
    return { unlocked };
  }

  /**
   * Verificar logros de limpieza
   */
  async checkCleaningAchievements(userId) {
    const user = await User.findById(userId).populate('pets');
    const unlocked = [];

    // Logro: Cuida bien
    const healthyPet = user.pets.find(pet => pet.health >= 100);
    if (healthyPet) {
      const achievement = await Achievement.findOne({ criteria: 'pet_health_100' });
      if (achievement && !user.unlockedAchievements.some(u => u.achievement.toString() === achievement._id.toString())) {
        user.coins += achievement.reward.coins;
        user.unlockedAchievements.push({ achievement: achievement._id });
        unlocked.push(achievement);
      }
    }

    await user.save();
    return { unlocked };
  }

  /**
   * Verificar logros de descanso
   */
  async checkSleepingAchievements(userId) {
    // Por ahora no hay logros específicos de descanso
    return { unlocked: [] };
  }

  /**
   * Obtener logros del usuario
   */
  async getUserAchievements(userId) {
    const user = await User.findById(userId).populate('unlockedAchievements.achievement');
    const allAchievements = await Achievement.find();
    
    return {
      unlocked: user.unlockedAchievements.map(u => u.achievement),
      all: allAchievements,
      progress: user.achievementProgress
    };
  }
}

export default new AchievementService(); 