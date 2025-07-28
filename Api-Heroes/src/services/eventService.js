import Event from '../models/eventModel.js';
import User from '../models/userModel.js';
import Item from '../models/itemModel.js';

// Plantillas de eventos especiales
const EVENT_TEMPLATES = [
  {
    name: 'Frenesí de Alimentación',
    description: '¡Alimenta a tus mascotas sin parar! Recompensas dobles por cada alimentación.',
    type: 'feeding_frenzy',
    icon: '🍖',
    duration: 2, // horas
    rewards: {
      coins: 100,
      specialReward: 'Corona de Alimentador'
    },
    objectives: [
      {
        action: 'feeding',
        target: 10,
        description: 'Alimenta 10 veces',
        reward: 50
      },
      {
        action: 'feeding',
        target: 25,
        description: 'Alimenta 25 veces',
        reward: 100
      },
      {
        action: 'feeding',
        target: 50,
        description: 'Alimenta 50 veces',
        reward: 200
      }
    ],
    theme: {
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff',
      specialEffects: ['sparkle', 'bounce']
    }
  },
  {
    name: 'Maratón de Cuidados',
    description: '¡Demuestra tu amor por las mascotas! Cuidados extra valen más.',
    type: 'care_marathon',
    icon: '💝',
    duration: 3,
    rewards: {
      coins: 150,
      specialReward: 'Medalla de Cuidadoso'
    },
    objectives: [
      {
        action: 'care',
        target: 8,
        description: 'Cuida 8 veces',
        reward: 60
      },
      {
        action: 'care',
        target: 15,
        description: 'Cuida 15 veces',
        reward: 120
      },
      {
        action: 'care',
        target: 30,
        description: 'Cuida 30 veces',
        reward: 250
      }
    ],
    theme: {
      backgroundColor: '#4ecdc4',
      textColor: '#ffffff',
      specialEffects: ['glow', 'pulse']
    }
  },
  {
    name: 'Fiesta de Compras',
    description: '¡La tienda está de rebajas! Descuentos especiales y recompensas únicas.',
    type: 'shopping_spree',
    icon: '🛍️',
    duration: 4,
    rewards: {
      coins: 200,
      specialReward: 'Tarjeta VIP'
    },
    objectives: [
      {
        action: 'shop',
        target: 5,
        description: 'Compra 5 objetos',
        reward: 80
      },
      {
        action: 'shop',
        target: 10,
        description: 'Compra 10 objetos',
        reward: 150
      },
      {
        action: 'shop',
        target: 20,
        description: 'Compra 20 objetos',
        reward: 300
      }
    ],
    theme: {
      backgroundColor: '#45b7d1',
      textColor: '#ffffff',
      specialEffects: ['rainbow', 'twinkle']
    }
  },
  {
    name: 'Fiesta de Mascotas',
    description: '¡Celebra con tus mascotas! Todas las acciones valen más durante la fiesta.',
    type: 'pet_party',
    icon: '🎉',
    duration: 6,
    rewards: {
      coins: 300,
      specialReward: 'Sombrero de Fiesta'
    },
    objectives: [
      {
        action: 'any',
        target: 20,
        description: 'Realiza 20 acciones',
        reward: 100
      },
      {
        action: 'any',
        target: 40,
        description: 'Realiza 40 acciones',
        reward: 200
      },
      {
        action: 'any',
        target: 60,
        description: 'Realiza 60 acciones',
        reward: 400
      }
    ],
    theme: {
      backgroundColor: '#f9ca24',
      textColor: '#2d3436',
      specialEffects: ['confetti', 'balloons']
    }
  }
];

// Generar evento aleatorio
async function generateRandomEvent() {
  try {
    // Verificar si ya hay un evento activo
    const activeEvent = await Event.findOne({ isActive: true });
    if (activeEvent) return null;

    // Seleccionar evento aleatorio
    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + template.duration * 60 * 60 * 1000);

    const event = new Event({
      ...template,
      startDate,
      endDate,
      isActive: true
    });

    await event.save();
    console.log(`[EVENT] Evento generado: ${event.name}`);
    return event;
  } catch (error) {
    console.error('Error generating event:', error);
    return null;
  }
}

// Verificar y actualizar progreso de eventos
async function checkAndUpdateEventProgress(userId, actionType, progress = 1) {
  try {
    const activeEvent = await Event.findOne({ isActive: true });
    if (!activeEvent) return { completed: [], event: null };

    const user = await User.findById(userId);
    if (!user) return { completed: [], event: activeEvent };

    // Buscar o crear participación del usuario
    let participation = activeEvent.participants.find(p => p.userId.toString() === userId.toString());
    if (!participation) {
      participation = {
        userId,
        progress: new Map(),
        completed: [],
        joinedAt: new Date()
      };
      activeEvent.participants.push(participation);
    }

    // Actualizar progreso
    const currentProgress = participation.progress.get(actionType) || 0;
    const newProgress = currentProgress + progress;
    participation.progress.set(actionType, newProgress);

    // Verificar objetivos completados
    const completed = [];
    for (const objective of activeEvent.objectives) {
      if (objective.action === actionType || objective.action === 'any') {
        const objectiveProgress = participation.progress.get(objective.action) || 0;
        if (objectiveProgress >= objective.target && !participation.completed.includes(objective.description)) {
          participation.completed.push(objective.description);
          
          // Otorgar recompensa
          user.coins = (user.coins || 0) + objective.reward;
          
          completed.push({
            description: objective.description,
            reward: objective.reward
          });
        }
      }
    }

    if (completed.length > 0) {
      await Promise.all([activeEvent.save(), user.save()]);
    } else {
      await activeEvent.save();
    }

    return { completed, event: activeEvent };
  } catch (error) {
    console.error('Error checking event progress:', error);
    return { completed: [], event: null };
  }
}

// Obtener evento activo
async function getActiveEvent() {
  try {
    const event = await Event.findOne({ isActive: true });
    return event;
  } catch (error) {
    console.error('Error getting active event:', error);
    return null;
  }
}

// Obtener progreso del usuario en evento activo
async function getUserEventProgress(userId) {
  try {
    const event = await Event.findOne({ isActive: true });
    if (!event) return null;

    const participation = event.participants.find(p => p.userId.toString() === userId.toString());
    if (!participation) return { event, progress: new Map(), completed: [] };

    return {
      event,
      progress: participation.progress,
      completed: participation.completed
    };
  } catch (error) {
    console.error('Error getting user event progress:', error);
    return null;
  }
}

// Finalizar eventos expirados
async function finalizeExpiredEvents() {
  try {
    const expiredEvents = await Event.find({
      isActive: true,
      endDate: { $lt: new Date() }
    });

    for (const event of expiredEvents) {
      event.isActive = false;
      await event.save();
      console.log(`[EVENT] Evento finalizado: ${event.name}`);
    }

    return expiredEvents.length;
  } catch (error) {
    console.error('Error finalizing events:', error);
    return 0;
  }
}

// Programar eventos automáticos
async function scheduleEvents() {
  try {
    // Finalizar eventos expirados
    await finalizeExpiredEvents();

    // Generar nuevo evento si no hay uno activo
    const activeEvent = await Event.findOne({ isActive: true });
    if (!activeEvent) {
      // 20% de probabilidad de generar evento
      if (Math.random() < 0.2) {
        await generateRandomEvent();
      }
    }
  } catch (error) {
    console.error('Error scheduling events:', error);
  }
}

export default {
  generateRandomEvent,
  checkAndUpdateEventProgress,
  getActiveEvent,
  getUserEventProgress,
  finalizeExpiredEvents,
  scheduleEvents
}; 