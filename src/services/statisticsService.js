import User from '../models/userModel.js';
import Pet from '../models/petModel.js';
import Hero from '../models/heroModel.js';

class StatisticsService {
  /**
   * Obtener estadísticas del usuario
   */
  async getUserStatistics(userId) {
    const user = await User.findById(userId).populate('pets heroes');
    
    const totalPets = user.pets ? user.pets.length : 0;
    const alivePets = user.pets ? user.pets.filter(p => p.status !== 'dead').length : 0;
    const totalHeroes = user.heroes ? user.heroes.length : 0;
    
    const averagePetHealth = user.pets && user.pets.length > 0 
      ? user.pets.reduce((sum, p) => sum + (p.health || 0), 0) / user.pets.length 
      : 0;
    
    const averagePetHappiness = user.pets && user.pets.length > 0 
      ? user.pets.reduce((sum, p) => sum + (p.happiness || 0), 0) / user.pets.length 
      : 0;

    return {
      totalPets,
      alivePets,
      totalHeroes,
      averagePetHealth: Math.round(averagePetHealth),
      averagePetHappiness: Math.round(averagePetHappiness),
      coins: user.coins || 0,
      level: user.level || 1,
      experience: user.experience || 0
    };
  }

  /**
   * Obtener recomendaciones para el usuario
   */
  async getUserRecommendations(userId) {
    const user = await User.findById(userId).populate('pets');
    const recommendations = [];

    if (!user.pets || user.pets.length === 0) {
      recommendations.push({
        type: 'adopt_pet',
        title: 'Adopta tu primera mascota',
        description: '¡Comienza tu aventura adoptando una mascota!',
        priority: 'high'
      });
    }

    if (!user.heroes || user.heroes.length === 0) {
      recommendations.push({
        type: 'create_hero',
        title: 'Crea tu primer héroe',
        description: '¡Personaliza tu héroe y comienza a luchar!',
        priority: 'high'
      });
    }

    const lowHealthPets = user.pets ? user.pets.filter(p => p.health < 30) : [];
    if (lowHealthPets.length > 0) {
      recommendations.push({
        type: 'care_pets',
        title: 'Cuida a tus mascotas',
        description: `Tienes ${lowHealthPets.length} mascota(s) con poca salud`,
        priority: 'medium'
      });
    }

    const lowHappinessPets = user.pets ? user.pets.filter(p => p.happiness < 30) : [];
    if (lowHappinessPets.length > 0) {
      recommendations.push({
        type: 'play_pets',
        title: 'Juega con tus mascotas',
        description: `Tienes ${lowHappinessPets.length} mascota(s) triste(s)`,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Obtener estadísticas comparativas
   */
  async getComparativeStatistics(userId) {
    const user = await User.findById(userId);
    const allUsers = await User.find();
    
    // Rankings
    const coinRanking = allUsers
      .sort((a, b) => (b.coins || 0) - (a.coins || 0))
      .findIndex(u => u._id.toString() === userId.toString()) + 1;
    
    const totalUsers = allUsers.length;
    const coinPercentile = Math.round(((totalUsers - coinRanking + 1) / totalUsers) * 100);

    return {
      coinRanking,
      totalUsers,
      coinPercentile,
      userCoins: user.coins || 0,
      averageCoins: Math.round(allUsers.reduce((sum, u) => sum + (u.coins || 0), 0) / totalUsers)
    };
  }

  /**
   * Obtener estadísticas globales
   */
  async getGlobalStatistics() {
    const totalUsers = await User.countDocuments();
    const totalPets = await Pet.countDocuments();
    const totalHeroes = await Hero.countDocuments();
    const alivePets = await Pet.countDocuments({ status: { $ne: 'dead' } });

    return {
      totalUsers,
      totalPets,
      totalHeroes,
      alivePets,
      deadPets: totalPets - alivePets
    };
  }
}

export default new StatisticsService(); 