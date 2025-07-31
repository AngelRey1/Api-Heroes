// src/services/petCareService.js
import Pet from '../models/petModel.js';
import User from '../models/userModel.js';

class PetCareService {
  async feedPet(petId, userId) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) throw new Error('Mascota no encontrada');
      if (pet.owner.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para cuidar esta mascota');
      }

      // Verificar cooldown - manejar lastCare como objeto o fecha
      let lastFeed = 0;
      if (pet.lastCare) {
        if (pet.lastCare instanceof Date) {
          lastFeed = pet.lastCare.getTime();
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.feed) {
          lastFeed = pet.lastCare.feed;
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.last) {
          lastFeed = pet.lastCare.last;
        }
      }
      
      const now = Date.now();
      const timeSinceLastFeed = now - lastFeed;
      
      // Sistema de consecuencias por alimentación excesiva
      let message = 'Mascota alimentada exitosamente';
      let healthChange = 25;
      let happinessChange = 15;
      let energyChange = 10;
      
      // Si alimenta muy seguido (menos de 10 minutos)
      if (timeSinceLastFeed < 10 * 60 * 1000) {
        // Indigestión - reduce salud y felicidad
        healthChange = -10;
        happinessChange = -20;
        energyChange = -5;
        message = '¡La mascota tiene indigestión por comer demasiado!';
        
        // Agregar enfermedad temporal
        if (!pet.diseases) pet.diseases = [];
        pet.diseases.push({
          type: 'indigestion',
          severity: 'moderate',
          startTime: new Date(),
          duration: 30 * 60 * 1000 // 30 minutos
        });
      }
      // Si alimenta moderadamente (entre 10-30 minutos)
      else if (timeSinceLastFeed < 30 * 60 * 1000) {
        healthChange = 15;
        happinessChange = 10;
        energyChange = 5;
        message = 'La mascota come con moderación';
      }
      // Si alimenta después de mucho tiempo (más de 30 minutos)
      else {
        healthChange = 25;
        happinessChange = 20;
        energyChange = 15;
        message = '¡La mascota come con gusto!';
      }

      // Actualizar estadísticas
      pet.health = Math.max(0, Math.min(100, (pet.health || 0) + healthChange));
      pet.happiness = Math.max(0, Math.min(100, (pet.happiness || 0) + happinessChange));
      pet.energy = Math.max(0, Math.min(100, (pet.energy || 0) + energyChange));
      
      // Actualizar último cuidado como fecha simple
      pet.lastCare = new Date();

      // Agregar a historial de actividades
      if (!pet.activityHistory) pet.activityHistory = [];
      pet.activityHistory.push({
        action: 'feed',
        date: new Date(),
        notes: message,
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      });

      await pet.save();

      return {
        message,
        pet: {
          health: pet.health,
          happiness: pet.happiness,
          energy: pet.energy
        },
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      };
    } catch (error) {
      console.error('Error en feedPet:', error);
      throw error;
    }
  }

  async playWithPet(petId, userId) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) throw new Error('Mascota no encontrada');
      if (pet.owner.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para cuidar esta mascota');
      }

      // Verificar cooldown - manejar lastCare como objeto o fecha
      let lastPlay = 0;
      if (pet.lastCare) {
        if (pet.lastCare instanceof Date) {
          lastPlay = pet.lastCare.getTime();
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.play) {
          lastPlay = pet.lastCare.play;
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.last) {
          lastPlay = pet.lastCare.last;
        }
      }
      
      const now = Date.now();
      const timeSinceLastPlay = now - lastPlay;
      
      // Sistema de consecuencias por juego excesivo
      let message = 'Mascota jugó exitosamente';
      let healthChange = 5;
      let happinessChange = 30;
      let energyChange = -15;
      
      // Si juega muy seguido (menos de 5 minutos)
      if (timeSinceLastPlay < 5 * 60 * 1000) {
        // Agotamiento - reduce energía y felicidad
        healthChange = -5;
        happinessChange = -10;
        energyChange = -25;
        message = '¡La mascota está agotada de tanto jugar!';
        
        // Agregar enfermedad temporal
        if (!pet.diseases) pet.diseases = [];
        pet.diseases.push({
          type: 'exhaustion',
          severity: 'mild',
          startTime: new Date(),
          duration: 15 * 60 * 1000 // 15 minutos
        });
      }
      // Si juega moderadamente (entre 5-15 minutos)
      else if (timeSinceLastPlay < 15 * 60 * 1000) {
        healthChange = 5;
        happinessChange = 20;
        energyChange = -10;
        message = 'La mascota juega con moderación';
      }
      // Si juega después de descansar (más de 15 minutos)
      else {
        healthChange = 10;
        happinessChange = 35;
        energyChange = -5;
        message = '¡La mascota se divierte mucho!';
      }

      // Actualizar estadísticas
      pet.health = Math.max(0, Math.min(100, (pet.health || 0) + healthChange));
      pet.happiness = Math.max(0, Math.min(100, (pet.happiness || 0) + happinessChange));
      pet.energy = Math.max(0, Math.min(100, (pet.energy || 0) + energyChange));
      
      // Actualizar último cuidado como fecha simple
      pet.lastCare = new Date();

      // Agregar a historial de actividades
      if (!pet.activityHistory) pet.activityHistory = [];
      pet.activityHistory.push({
        action: 'play',
        date: new Date(),
        notes: message,
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      });

      await pet.save();

      return {
        message,
        pet: {
          health: pet.health,
          happiness: pet.happiness,
          energy: pet.energy
        },
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      };
    } catch (error) {
      console.error('Error en playWithPet:', error);
      throw error;
    }
  }

  async bathPet(petId, userId) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) throw new Error('Mascota no encontrada');
      if (pet.owner.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para cuidar esta mascota');
      }

      // Verificar cooldown - manejar lastCare como objeto o fecha
      let lastBath = 0;
      if (pet.lastCare) {
        if (pet.lastCare instanceof Date) {
          lastBath = pet.lastCare.getTime();
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.bath) {
          lastBath = pet.lastCare.bath;
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.last) {
          lastBath = pet.lastCare.last;
        }
      }
      
      const now = Date.now();
      const timeSinceLastBath = now - lastBath;
      
      // Sistema de consecuencias por baño excesivo
      let message = 'Mascota bañada exitosamente';
      let healthChange = 20;
      let happinessChange = 10;
      let energyChange = 5;
      
      // Si baña muy seguido (menos de 20 minutos)
      if (timeSinceLastBath < 20 * 60 * 1000) {
        // Piel seca - reduce felicidad y salud
        healthChange = -5;
        happinessChange = -15;
        energyChange = -5;
        message = '¡La mascota tiene la piel seca por bañarse mucho!';
        
        // Agregar enfermedad temporal
        if (!pet.diseases) pet.diseases = [];
        pet.diseases.push({
          type: 'dry_skin',
          severity: 'mild',
          startTime: new Date(),
          duration: 20 * 60 * 1000 // 20 minutos
        });
      }
      // Si baña moderadamente (entre 20-60 minutos)
      else if (timeSinceLastBath < 60 * 60 * 1000) {
        healthChange = 15;
        happinessChange = 8;
        energyChange = 3;
        message = 'La mascota se siente limpia';
      }
      // Si baña después de mucho tiempo (más de 1 hora)
      else {
        healthChange = 25;
        happinessChange = 15;
        energyChange = 8;
        message = '¡La mascota se siente muy limpia y fresca!';
      }

      // Actualizar estadísticas
      pet.health = Math.max(0, Math.min(100, (pet.health || 0) + healthChange));
      pet.happiness = Math.max(0, Math.min(100, (pet.happiness || 0) + happinessChange));
      pet.energy = Math.max(0, Math.min(100, (pet.energy || 0) + energyChange));
      
      // Actualizar último cuidado como fecha simple
      pet.lastCare = new Date();

      // Agregar a historial de actividades
      if (!pet.activityHistory) pet.activityHistory = [];
      pet.activityHistory.push({
        action: 'bath',
        date: new Date(),
        notes: message,
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      });

      await pet.save();

      return {
        message,
        pet: {
          health: pet.health,
          happiness: pet.happiness,
          energy: pet.energy
        },
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      };
    } catch (error) {
      console.error('Error en bathPet:', error);
      throw error;
    }
  }

  async sleepPet(petId, userId) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) throw new Error('Mascota no encontrada');
      if (pet.owner.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para cuidar esta mascota');
      }

      // Verificar cooldown - manejar lastCare como objeto o fecha
      let lastSleep = 0;
      if (pet.lastCare) {
        if (pet.lastCare instanceof Date) {
          lastSleep = pet.lastCare.getTime();
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.sleep) {
          lastSleep = pet.lastCare.sleep;
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.last) {
          lastSleep = pet.lastCare.last;
        }
      }
      
      const now = Date.now();
      const timeSinceLastSleep = now - lastSleep;
      
      // Sistema de consecuencias por sueño excesivo
      let message = 'Mascota durmió exitosamente';
      let healthChange = 10;
      let happinessChange = 5;
      let energyChange = 50;
      
      // Si duerme muy seguido (menos de 30 minutos)
      if (timeSinceLastSleep < 30 * 60 * 1000) {
        // Somnolencia - reduce felicidad y energía
        healthChange = 5;
        happinessChange = -10;
        energyChange = 20;
        message = '¡La mascota está somnolienta de tanto dormir!';
        
        // Agregar enfermedad temporal
        if (!pet.diseases) pet.diseases = [];
        pet.diseases.push({
          type: 'sleepiness',
          severity: 'mild',
          startTime: new Date(),
          duration: 10 * 60 * 1000 // 10 minutos
        });
      }
      // Si duerme moderadamente (entre 30-60 minutos)
      else if (timeSinceLastSleep < 60 * 60 * 1000) {
        healthChange = 8;
        happinessChange = 3;
        energyChange = 35;
        message = 'La mascota descansa bien';
      }
      // Si duerme después de estar despierta (más de 1 hora)
      else {
        healthChange = 15;
        happinessChange = 10;
        energyChange = 60;
        message = '¡La mascota se siente muy descansada!';
      }

      // Actualizar estadísticas
      pet.health = Math.max(0, Math.min(100, (pet.health || 0) + healthChange));
      pet.happiness = Math.max(0, Math.min(100, (pet.happiness || 0) + happinessChange));
      pet.energy = Math.max(0, Math.min(100, (pet.energy || 0) + energyChange));
      
      // Actualizar último cuidado como fecha simple
      pet.lastCare = new Date();

      // Agregar a historial de actividades
      if (!pet.activityHistory) pet.activityHistory = [];
      pet.activityHistory.push({
        action: 'sleep',
        date: new Date(),
        notes: message,
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      });

      await pet.save();

      return {
        message,
        pet: {
          health: pet.health,
          happiness: pet.happiness,
          energy: pet.energy
        },
        consequences: {
          healthChange,
          happinessChange,
          energyChange
        }
      };
    } catch (error) {
      console.error('Error en sleepPet:', error);
      throw error;
    }
  }

  /**
   * Curar mascota - CON LÓGICA DE ENFERMEDADES
   */
  async healPet(petId, userId) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) throw new Error('Mascota no encontrada');
      if (pet.owner.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para curar esta mascota');
      }

      // Verificar cooldown (1 hora)
      let lastHeal = 0;
      if (pet.lastCare) {
        if (pet.lastCare instanceof Date) {
          lastHeal = pet.lastCare.getTime();
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.heal) {
          lastHeal = pet.lastCare.heal;
        } else if (typeof pet.lastCare === 'object' && pet.lastCare.last) {
          lastHeal = pet.lastCare.last;
        }
      }
      
      const now = Date.now();
      const timeSinceLastHeal = now - lastHeal;
      
      // Sistema de curación inteligente
      let message = 'Mascota curada exitosamente';
      let healthChange = 50;
      let happinessChange = 20;
      let energyChange = 15;
      let diseasesCured = [];
      
      // Si cura muy seguido (menos de 30 minutos)
      if (timeSinceLastHeal < 30 * 60 * 1000) {
        // Resistencia a medicamentos - reduce efectividad
        healthChange = 10;
        happinessChange = -5;
        energyChange = -10;
        message = '¡La mascota está desarrollando resistencia a los medicamentos!';
      }
      // Si cura moderadamente (entre 30-60 minutos)
      else if (timeSinceLastHeal < 60 * 60 * 1000) {
        healthChange = 30;
        happinessChange = 10;
        energyChange = 5;
        message = 'La mascota se siente mejor';
      }
      // Si cura después de mucho tiempo (más de 1 hora)
      else {
        healthChange = 50;
        happinessChange = 25;
        energyChange = 20;
        message = '¡La mascota se siente completamente curada!';
      }

      // Curar enfermedades existentes
      if (pet.diseases && pet.diseases.length > 0) {
        const currentTime = Date.now();
        const activeDiseases = pet.diseases.filter(disease => {
          const diseaseEndTime = disease.startTime.getTime() + disease.duration;
          return currentTime < diseaseEndTime;
        });
        
        if (activeDiseases.length > 0) {
          // Curar todas las enfermedades activas
          pet.diseases = pet.diseases.filter(disease => {
            const diseaseEndTime = disease.startTime.getTime() + disease.duration;
            const isActive = currentTime < diseaseEndTime;
            if (isActive) {
              diseasesCured.push(disease.type);
            }
            return !isActive; // Mantener solo las enfermedades no activas
          });
          
          // Bonus por curar enfermedades
          healthChange += 20;
          happinessChange += 15;
          message = `¡Enfermedades curadas: ${diseasesCured.join(', ')}! La mascota se siente mucho mejor.`;
        }
      }

      // Actualizar estadísticas
      pet.health = Math.max(0, Math.min(100, (pet.health || 0) + healthChange));
      pet.happiness = Math.max(0, Math.min(100, (pet.happiness || 0) + happinessChange));
      pet.energy = Math.max(0, Math.min(100, (pet.energy || 0) + energyChange));
      
      // Actualizar último cuidado
      pet.lastCare = new Date();

      // Agregar a historial de actividades
      if (!pet.activityHistory) pet.activityHistory = [];
      pet.activityHistory.push({
        action: 'heal',
        date: new Date(),
        notes: message,
        consequences: {
          healthChange,
          happinessChange,
          energyChange,
          diseasesCured
        }
      });

      await pet.save();

      return {
        message,
        pet: {
          health: pet.health,
          happiness: pet.happiness,
          energy: pet.energy
        },
        consequences: {
          healthChange,
          happinessChange,
          energyChange,
          diseasesCured
        }
      };
    } catch (error) {
      console.error('Error en healPet:', error);
      throw error;
    }
  }

  // Decay de estadísticas cada hora
  async decayPetStats() {
    try {
      const pets = await Pet.find({});
      const now = Date.now();

      for (const pet of pets) {
        if (!pet.lastCare?.last) continue;

        const hoursSinceLastCare = (now - pet.lastCare.last) / (1000 * 60 * 60);
        
        if (hoursSinceLastCare >= 1) {
          // Decay de estadísticas
          pet.health = Math.max(0, (pet.health || 0) - 2);
          pet.happiness = Math.max(0, (pet.happiness || 0) - 3);
          pet.energy = Math.max(0, (pet.energy || 0) - 1);

          await pet.save();
        }
      }
    } catch (error) {
      console.error('Error en decay de estadísticas:', error);
    }
  }

  async getPetStatus(petId, userId) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) throw new Error('Mascota no encontrada');
      if (pet.owner.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para ver esta mascota');
      }

      return {
        health: pet.health || 0,
        happiness: pet.happiness || 0,
        energy: pet.energy || 0,
        lastCare: pet.lastCare || {},
        activityHistory: pet.activityHistory || []
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar abandono y aplicar consecuencias
   */
  async checkAbandonment(petId, userId) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) throw new Error('Mascota no encontrada');
      if (pet.owner.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para ver esta mascota');
      }

      const lastCare = pet.lastCare?.last || 0;
      const now = Date.now();
      const hoursSinceLastCare = (now - lastCare) / (1000 * 60 * 60);

      return {
        abandoned: hoursSinceLastCare > 24,
        hoursSinceLastCare: Math.floor(hoursSinceLastCare),
        needsAttention: hoursSinceLastCare > 12
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas de cuidado mejoradas
   */
  async getCareStats(userId) {
    try {
      const pets = await Pet.find({ owner: userId });
      const stats = {
        totalPets: pets.length,
        averageHealth: 0,
        averageHappiness: 0,
        averageEnergy: 0,
        needsAttention: 0
      };

      if (pets.length > 0) {
        const totalHealth = pets.reduce((sum, pet) => sum + (pet.health || 0), 0);
        const totalHappiness = pets.reduce((sum, pet) => sum + (pet.happiness || 0), 0);
        const totalEnergy = pets.reduce((sum, pet) => sum + (pet.energy || 0), 0);

        stats.averageHealth = Math.round(totalHealth / pets.length);
        stats.averageHappiness = Math.round(totalHappiness / pets.length);
        stats.averageEnergy = Math.round(totalEnergy / pets.length);

        // Contar mascotas que necesitan atención
        stats.needsAttention = pets.filter(pet => {
          const health = pet.health || 0;
          const happiness = pet.happiness || 0;
          const energy = pet.energy || 0;
          return health < 30 || happiness < 30 || energy < 30;
        }).length;
      }

      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Customizar mascota - MEJORADO
   */
  async customizePet(petId, userId, customization) {
    const pet = await Pet.findOne({ _id: petId, owner: userId });
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }

    // Validar datos de customización
    if (customization.name && customization.name.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (customization.name && customization.name.length > 20) {
      throw new Error('El nombre no puede tener más de 20 caracteres');
    }

    // Aplicar customización
    if (customization.name) pet.name = customization.name;
    if (customization.color) pet.color = customization.color;
    if (customization.forma) pet.forma = customization.forma;
    
    // Registrar actividad
    if (!pet.activityHistory) pet.activityHistory = [];
    pet.activityHistory.push({
      action: 'customize',
      date: new Date(),
      notes: `Personalización: ${Object.keys(customization).join(', ')}`
    });

    await pet.save();
    return {
      ...pet.toObject(),
      message: 'Personalización aplicada correctamente'
    };
  }
}

export default PetCareService; 