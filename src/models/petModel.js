import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: { type: String, required: true, description: 'Nombre de la mascota' },
    type: { type: String, required: true, description: 'Tipo de mascota (perro, gato, pájaro, etc.)' },
    petType: { type: String, description: 'Tipo específico de mascota (Golden Retriever, Persa, Canario, etc.)' },
    superPower: { type: String, description: 'Superpoder especial de la mascota' },
    personality: { type: String, default: 'normal', description: 'Personalidad de la mascota' },
    accessories: [{ type: String, description: 'Accesorios de la mascota' }],
    adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero', default: null, description: 'ID del héroe que adoptó la mascota' },
    adoptionHistory: [{
        hero: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero', description: 'ID del héroe que adoptó' },
        date: { type: Date, default: Date.now, description: 'Fecha de adopción' },
        reason: { type: String, description: 'Motivo de adopción' },
        notes: { type: String, description: 'Notas adicionales' }
    }],
    status: { type: String, default: 'viva', enum: ['viva', 'available', 'adopted', 'returned', 'dead', 'enferma'], description: 'Estado de la mascota' },
    
    // Sistema de estadísticas en tiempo real (como en la imagen)
    health: { type: Number, default: 100, min: 0, max: 100, description: 'Nivel de salud (0-100)' },
    happiness: { type: Number, default: 100, min: 0, max: 100, description: 'Nivel de felicidad (0-100)' },
    sleep: { type: Number, default: 100, min: 0, max: 100, description: 'Nivel de sueño/descanso (0-100)' },
    hunger: { type: Number, default: 0, min: 0, max: 100, description: 'Nivel de hambre (0-100)' },
    cleanliness: { type: Number, default: 100, min: 0, max: 100, description: 'Nivel de limpieza (0-100)' },
    energy: { type: Number, default: 100, min: 0, max: 100, description: 'Nivel de energía (0-100)' },
    
    // Tiempo real - últimos cuidados
    lastFed: { type: Date, default: Date.now, description: 'Última vez que comió' },
    lastWatered: { type: Date, default: Date.now, description: 'Última vez que bebió' },
    lastPlayed: { type: Date, default: Date.now, description: 'Última vez que jugó' },
    lastWalked: { type: Date, default: Date.now, description: 'Última vez que salió a pasear' },
    lastBathed: { type: Date, default: Date.now, description: 'Última vez que se bañó' },
    lastSlept: { type: Date, default: Date.now, description: 'Última vez que durmió' },
    lastPet: { type: Date, default: Date.now, description: 'Última vez que fue acariciada' },
    lastHealed: { type: Date, default: Date.now, description: 'Última vez que fue curada' },
    
    // Configuración de degradación en tiempo real
    hungerRate: { type: Number, default: 3, description: 'Puntos de hambre que gana por hora' },
    thirstRate: { type: Number, default: 4, description: 'Puntos de sed que gana por hora' },
    energyDecayRate: { type: Number, default: 2, description: 'Puntos de energía que pierde por hora' },
    happinessDecayRate: { type: Number, default: 1, description: 'Puntos de felicidad que pierde por hora' },
    cleanlinessDecayRate: { type: Number, default: 1.5, description: 'Puntos de limpieza que pierde por hora' },
    sleepDecayRate: { type: Number, default: 2, description: 'Puntos de sueño que pierde por hora' },
    healthDecayRate: { type: Number, default: 0.5, description: 'Puntos de salud que pierde por hora cuando está mal cuidada' },
    
    // Estado de sueño
    isSleeping: { type: Boolean, default: false, description: 'Si la mascota está durmiendo' },
    sleepStartTime: { type: Date, description: 'Cuándo empezó a dormir' },
    
    // Estado de ánimo y comportamiento
    mood: { type: String, default: 'happy', enum: ['happy', 'sad', 'angry', 'excited', 'tired', 'hungry', 'thirsty', 'dirty', 'sick', 'sleepy'], description: 'Estado de ánimo actual' },
    
    // Sistema de enfermedades
    isSick: { type: Boolean, default: false, description: 'Si la mascota está enferma' },
    sickness: { type: String, description: 'Tipo de enfermedad actual' },
    sicknessStartTime: { type: Date, description: 'Cuándo empezó la enfermedad' },
    
    // Historial de actividades
    activityHistory: [{
        action: { type: String, description: 'Acción realizada (feed, water, walk, play, bath, heal, sleep, wake, pet, customize)' },
        date: { type: Date, default: Date.now, description: 'Fecha de la acción' },
        notes: { type: String, description: 'Notas de la acción' },
        // Campos adicionales según la acción
        food: { type: String, description: 'Tipo de comida (solo para feed)' },
        water: { type: String, description: 'Tipo de agua (solo para water)' },
        disease: { type: String, description: 'Enfermedad (solo para sick/heal)' },
        item: { type: String, description: 'Item de customización (solo para customize)' },
        type: { type: String, description: 'Tipo de customización (solo para customize)' },
        duration: { type: Number, description: 'Duración en minutos (para sleep)' },
        effect: { type: String, description: 'Efecto de la acción en las stats' }
    }],
    
    // Customización
    customization: {
        type: {
            free: [{ type: String, description: 'Objetos de customización gratuitos' }],
            paid: [{ type: String, description: 'Objetos de customización de pago' }]
        },
        default: { free: [], paid: [] }
    },
    
    // Enfermedades
    diseases: [{
        type: { type: String, required: true, description: 'Tipo de enfermedad' },
        severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild', description: 'Severidad de la enfermedad' },
        startTime: { type: Date, default: Date.now, description: 'Fecha de inicio de la enfermedad' },
        duration: { type: Number, description: 'Duración en milisegundos' }
    }],
    
    lastCare: { type: Date, default: Date.now, description: 'Fecha del último cuidado' },
    deathDate: { type: Date, default: null, description: 'Fecha de muerte' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, description: 'Propietario de la mascota (jugador)' },
    color: { type: String, default: '#FFD700', description: 'Color de la mascota' },
    forma: { type: String, default: 'normal', description: 'Forma visual de la mascota' },
    
    // Avatar y apariencia
    avatar: { type: String, default: '/assets/pet-default.png', description: 'URL del avatar de la mascota' },
    glowColor: { type: String, default: '#FF69B4', description: 'Color del glow alrededor del avatar' }
});

// Método para actualizar estadísticas en tiempo real
petSchema.methods.updateStats = function() {
    const now = new Date();
    
    // Calcular tiempo transcurrido desde el último cuidado
    const hoursSinceFed = (now - this.lastFed) / (1000 * 60 * 60);
    const hoursSinceWatered = (now - this.lastWatered) / (1000 * 60 * 60);
    const hoursSincePlayed = (now - this.lastPlayed) / (1000 * 60 * 60);
    const hoursSinceWalked = (now - this.lastWalked) / (1000 * 60 * 60);
    const hoursSinceBathed = (now - this.lastBathed) / (1000 * 60 * 60);
    const hoursSinceSlept = (now - this.lastSlept) / (1000 * 60 * 60);
    const hoursSincePet = (now - this.lastPet) / (1000 * 60 * 60);
    
    // Actualizar hambre
    this.hunger = Math.round(Math.min(100, this.hunger + (hoursSinceFed * this.hungerRate)));
    
    // Actualizar sed (usando thirst como parte del sistema de hidratación)
    const thirst = Math.round(Math.min(100, (hoursSinceWatered * this.thirstRate)));
    
    // Actualizar energía
    this.energy = Math.round(Math.max(0, this.energy - (hoursSincePlayed * this.energyDecayRate)));
    
    // Actualizar felicidad
    this.happiness = Math.round(Math.max(0, this.happiness - (hoursSincePet * this.happinessDecayRate)));
    
    // Actualizar limpieza
    this.cleanliness = Math.round(Math.max(0, this.cleanliness - (hoursSinceBathed * this.cleanlinessDecayRate)));
    
    // Actualizar sueño
    this.sleep = Math.round(Math.max(0, this.sleep - (hoursSinceSlept * this.sleepDecayRate)));
    
    // Si está durmiendo, recuperar energía y sueño
    if (this.isSleeping) {
        const sleepHours = (now - this.sleepStartTime) / (1000 * 60 * 60);
        this.energy = Math.round(Math.min(100, this.energy + (sleepHours * 5)));
        this.sleep = Math.round(Math.min(100, this.sleep + (sleepHours * 8)));
    }
    
    // Consecuencias por negligencia
    if (this.hunger > 80 || this.cleanliness < 20 || this.happiness < 20) {
        this.health = Math.round(Math.max(0, this.health - (hoursSinceFed * this.healthDecayRate)));
    }
    
    // Enfermedades por negligencia
    if (this.health < 30 && !this.isSick) {
        this.isSick = true;
        this.sickness = 'Desnutrición';
        this.sicknessStartTime = now;
        this.status = 'enferma';
    }
    
    // Muerte por negligencia extrema
    if (this.health <= 0) {
        this.status = 'dead';
        this.deathDate = now;
        this.isSleeping = false;
    }
    
    // Actualizar estado de ánimo
    this.updateMood();
    
    return this;
};

// Método para actualizar el estado de ánimo
petSchema.methods.updateMood = function() {
    if (this.status === 'dead') {
        this.mood = 'dead';
        return;
    }
    
    if (this.isSick) {
        this.mood = 'sick';
        return;
    }
    
    if (this.isSleeping) {
        this.mood = 'sleepy';
        return;
    }
    
    if (this.hunger > 70) {
        this.mood = 'hungry';
        return;
    }
    
    if (this.cleanliness < 30) {
        this.mood = 'dirty';
        return;
    }
    
    if (this.energy < 20) {
        this.mood = 'tired';
        return;
    }
    
    if (this.happiness > 80 && this.health > 80) {
        this.mood = 'excited';
        return;
    }
    
    if (this.happiness < 30) {
        this.mood = 'sad';
        return;
    }
    
    this.mood = 'happy';
};

// Método para alimentar
petSchema.methods.feed = function(foodType = 'regular') {
    if (this.status === 'dead') return false;
    
    const now = new Date();
    this.lastFed = now;
    this.hunger = Math.round(Math.max(0, this.hunger - 30));
    this.happiness = Math.round(Math.min(100, this.happiness + 10));
    this.health = Math.round(Math.min(100, this.health + 5));
    
    this.activityHistory.push({
        action: 'feed',
        date: now,
        food: foodType,
        effect: `Hambre -30, Felicidad +10, Salud +5`
    });
    
    this.updateMood();
    return true;
};

// Método para dar agua
petSchema.methods.water = function(waterType = 'regular') {
    if (this.status === 'dead') return false;
    
    const now = new Date();
    this.lastWatered = now;
    this.happiness = Math.round(Math.min(100, this.happiness + 5));
    this.health = Math.round(Math.min(100, this.health + 3));
    
    this.activityHistory.push({
        action: 'water',
        date: now,
        water: waterType,
        effect: `Felicidad +5, Salud +3`
    });
    
    this.updateMood();
    return true;
};

// Método para jugar
petSchema.methods.play = function() {
    if (this.status === 'dead' || this.energy < 15) return false;
    
    const now = new Date();
    this.lastPlayed = now;
    this.energy = Math.round(Math.max(0, this.energy - 15));
    this.happiness = Math.round(Math.min(100, this.happiness + 20));
    this.hunger = Math.round(Math.min(100, this.hunger + 10));
    
    this.activityHistory.push({
        action: 'play',
        date: now,
        effect: `Energía -15, Felicidad +20, Hambre +10`
    });
    
    this.updateMood();
    return true;
};

// Método para pasear
petSchema.methods.walk = function() {
    if (this.status === 'dead' || this.energy < 20) return false;
    
    const now = new Date();
    this.lastWalked = now;
    this.energy = Math.round(Math.max(0, this.energy - 20));
    this.happiness = Math.round(Math.min(100, this.happiness + 15));
    this.hunger = Math.round(Math.min(100, this.hunger + 15));
    this.cleanliness = Math.round(Math.max(0, this.cleanliness - 5));
    
    this.activityHistory.push({
        action: 'walk',
        date: now,
        effect: `Energía -20, Felicidad +15, Hambre +15, Limpieza -5`
    });
    
    this.updateMood();
    return true;
};

// Método para bañar
petSchema.methods.bathe = function() {
    if (this.status === 'dead') return false;
    
    const now = new Date();
    this.lastBathed = now;
    this.cleanliness = 100;
    this.happiness = Math.round(Math.min(100, this.happiness + 10));
    
    this.activityHistory.push({
        action: 'bath',
        date: now,
        effect: `Limpieza +100, Felicidad +10`
    });
    
    this.updateMood();
    return true;
};

// Método para dormir
petSchema.methods.startSleep = function() {
    if (this.status === 'dead' || this.isSleeping) return false;
    
    const now = new Date();
    this.isSleeping = true;
    this.sleepStartTime = now;
    this.lastSlept = now;
    this.mood = 'sleepy';
    
    this.activityHistory.push({
        action: 'sleep',
        date: now,
        effect: `Iniciando sueño`
    });
    
    return true;
};

// Método para despertar
petSchema.methods.wake = function() {
    if (this.status === 'dead' || !this.isSleeping) return false;
    
    const now = new Date();
    this.isSleeping = false;
    
    // Calcular tiempo dormido y recuperar stats
    const sleepHours = (now - this.sleepStartTime) / (1000 * 60 * 60);
    this.energy = Math.round(Math.min(100, this.energy + (sleepHours * 10)));
    this.sleep = Math.round(Math.min(100, this.sleep + (sleepHours * 15)));
    
    this.activityHistory.push({
        action: 'wake',
        date: now,
        duration: sleepHours * 60,
        effect: `Energía +${Math.floor(sleepHours * 10)}, Sueño +${Math.floor(sleepHours * 15)}`
    });
    
    this.updateMood();
    return true;
};

// Método para acariciar
petSchema.methods.pet = function() {
    if (this.status === 'dead') return false;
    
    const now = new Date();
    this.lastPet = now;
    this.happiness = Math.round(Math.min(100, this.happiness + 15));
    this.health = Math.round(Math.min(100, this.health + 3));
    
    this.activityHistory.push({
        action: 'pet',
        date: now,
        effect: `Felicidad +15, Salud +3`
    });
    
    this.updateMood();
    return true;
};

// Método para curar
petSchema.methods.heal = function() {
    if (this.status === 'dead') return false;
    
    const now = new Date();
    this.lastHealed = now;
    this.health = Math.round(Math.min(100, this.health + 30));
    
    if (this.isSick) {
        this.isSick = false;
        this.sickness = null;
        this.sicknessStartTime = null;
        this.status = 'viva';
    }
    
    this.activityHistory.push({
        action: 'heal',
        date: now,
        effect: `Salud +30, Enfermedad curada`
    });
    
    this.updateMood();
    return true;
};

// Método para obtener el estado de vida
petSchema.methods.getLifeStatus = function() {
    if (this.status === 'dead') return 'Muerta';
    if (this.isSick) return 'Enferma';
    return 'Viva';
};

// Método para obtener stats simplificadas (como en la imagen)
petSchema.methods.getBasicStats = function() {
    return {
        health: Math.round(this.health),
        happiness: Math.round(this.happiness),
        sleep: Math.round(this.sleep),
        hunger: Math.round(this.hunger),
        cleanliness: Math.round(this.cleanliness),
        energy: Math.round(this.energy),
        mood: this.mood,
        isSleeping: this.isSleeping,
        status: this.getLifeStatus()
    };
};

petSchema.method('toJSON', function() {
    const { _id, __v, ...object } = this.toObject();
    object._id = _id;
    object.id_corto = _id.toString().substring(0, 8);
    return object;
});

export default mongoose.model('Pet', petSchema); 