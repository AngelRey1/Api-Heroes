import Event from '../models/eventModel.js';
import User from '../models/userModel.js';

class EventService {
  /**
   * Programar eventos automáticos
   */
  async scheduleEvents() {
    const now = new Date();
    const activeEvents = await Event.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    if (activeEvents.length === 0) {
      // Crear evento automático
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const eventEnd = new Date(tomorrow);
      eventEnd.setDate(eventEnd.getDate() + 7);

      await Event.create({
        title: 'Evento Semanal',
        description: '¡Participa en el evento semanal!',
        type: 'weekly',
        startDate: tomorrow,
        endDate: eventEnd,
        objectives: [
          { action: 'feeding', goal: 10, reward: 50 },
          { action: 'playing', goal: 5, reward: 30 }
        ]
      });
    }
  }

  /**
   * Verificar y actualizar progreso de eventos
   */
  async checkAndUpdateEventProgress(userId, actionType, amount = 1) {
    const user = await User.findById(userId);
    if (!user) return { completed: [] };

    const currentProgress = user.eventProgress.get(actionType) || 0;
    const newProgress = currentProgress + amount;
    user.eventProgress.set(actionType, newProgress);

    const activeEvents = await Event.find({
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    const completed = [];

    for (const event of activeEvents) {
      for (const objective of event.objectives) {
        if (objective.action === actionType && newProgress >= objective.goal) {
          // Verificar si ya completó este objetivo
          const objectiveKey = `${event._id}-${objective.action}`;
          if (!user.completedEventObjectives || !user.completedEventObjectives.includes(objectiveKey)) {
            user.coins += objective.reward;
            user.completedEventObjectives = user.completedEventObjectives || [];
            user.completedEventObjectives.push(objectiveKey);
            completed.push({ event, objective });
          }
        }
      }
    }

    await user.save();
    return { completed };
  }

  /**
   * Obtener eventos activos
   */
  async getActiveEvents() {
    const now = new Date();
    return await Event.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
  }

  /**
   * Obtener progreso del usuario en eventos
   */
  async getUserEventProgress(userId) {
    const user = await User.findById(userId);
    const activeEvents = await this.getActiveEvents();

    return activeEvents.map(event => ({
      event,
      progress: user.eventProgress,
      completedObjectives: user.completedEventObjectives || []
    }));
  }
}

export default new EventService(); 