// src/services/petCareService.js
import Pet from '../models/petModel.js';
import User from '../models/userModel.js';

class PetCareService {
  /**
   * Alimentar mascota
   */
  async feedPet(petId, userId) {
    const pet = await Pet.findOne({ _id: petId, owner: userId });
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }

    // Aumentar salud y felicidad
    pet.health = Math.min(100, pet.health + 20);
    pet.happiness = Math.min(100, pet.happiness + 15);
    pet.hunger = Math.max(0, pet.hunger - 30);
    
    // Verificar si estaba enferma
    if (pet.health > 50 && pet.diseases && pet.diseases.length > 0) {
      pet.diseases = [];
    }

    await pet.save();
    return pet;
  }

  /**
   * Jugar con mascota
   */
  async playWithPet(petId, userId) {
    const pet = await Pet.findOne({ _id: petId, owner: userId });
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }

    // Aumentar felicidad y energía
    pet.happiness = Math.min(100, pet.happiness + 25);
    pet.energy = Math.max(0, pet.energy - 10);
    
    await pet.save();
    return pet;
  }

  /**
   * Bañar mascota
   */
  async bathPet(petId, userId) {
    const pet = await Pet.findOne({ _id: petId, owner: userId });
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }

    // Aumentar limpieza y felicidad
    pet.cleanliness = Math.min(100, pet.cleanliness + 30);
    pet.happiness = Math.min(100, pet.happiness + 10);
    
    await pet.save();
    return pet;
  }

  /**
   * Hacer dormir mascota
   */
  async sleepPet(petId, userId) {
    const pet = await Pet.findOne({ _id: petId, owner: userId });
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }

    // Restaurar energía
    pet.energy = Math.min(100, pet.energy + 50);
    pet.happiness = Math.min(100, pet.happiness + 5);
    
    await pet.save();
    return pet;
  }

  /**
   * Customizar mascota
   */
  async customizePet(petId, userId, customization) {
    const pet = await Pet.findOne({ _id: petId, owner: userId });
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }

    // Aplicar customización
    if (customization.name) pet.name = customization.name;
    if (customization.color) pet.color = customization.color;
    if (customization.forma) pet.forma = customization.forma;
    
    await pet.save();
    return pet;
  }

  /**
   * Degradar stats de mascota (cron job)
   */
  async decayPetStats(petId, hours, userId) {
    const pet = await Pet.findOne({ _id: petId, owner: userId });
    if (!pet || pet.status === 'dead') return;

    // Degradar stats por hora
    pet.health = Math.max(0, pet.health - (hours * 2));
    pet.happiness = Math.max(0, pet.happiness - (hours * 1.5));
    pet.energy = Math.max(0, pet.energy - (hours * 3));
    pet.cleanliness = Math.max(0, pet.cleanliness - (hours * 1));

    // Si la salud llega a 0, la mascota muere
    if (pet.health <= 0) {
      pet.status = 'dead';
    }

    await pet.save();
    return pet;
  }

  /**
   * Obtener estadísticas de cuidado
   */
  async getCareStats(userId) {
    const pets = await Pet.find({ owner: userId });
    const totalPets = pets.length;
    const alivePets = pets.filter(p => p.status !== 'dead').length;
    const averageHealth = pets.reduce((sum, p) => sum + (p.health || 0), 0) / totalPets || 0;
    const averageHappiness = pets.reduce((sum, p) => sum + (p.happiness || 0), 0) / totalPets || 0;

    return {
      totalPets,
      alivePets,
      averageHealth: Math.round(averageHealth),
      averageHappiness: Math.round(averageHappiness)
    };
  }
}

export default new PetCareService(); 