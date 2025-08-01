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
    
    // Configuración de degradación en tiempo real (por minuto)
    hungerRate: { type: Number, default: 0.5, description: 'Puntos de hambre que gana por minuto' },
    thirstRate: { type: Number, default: 0.3, description: 'Puntos de sed que gana por minuto' },
    energyDecayRate: { type: Number, default: 0.3, description: 'Puntos de energía que pierde por minuto' },
    happinessDecayRate: { type: Number, default: 0.2, description: 'Puntos de felicidad que pierde por minuto' },
    cleanlinessDecayRate: { type: Number, default: 0.25, description: 'Puntos de limpieza que pierde por minuto' },
    sleepDecayRate: { type: Number, default: 0.4, description: 'Puntos de sueño que gana por minuto' },
    healthDecayRate: { type: Number, default: 0.1, description: 'Puntos de salud que pierde por minuto cuando está mal cuidada' },
    
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
    avatar: { type: String, default: '', description: 'URL del avatar de la mascota' },
    glowColor: { type: String, default: '#FF69B4', description: 'Color del glow alrededor del avatar' }
});

// Método para actualizar estadísticas en tiempo real
petSchema.methods.updateStats = function() {
    const now = new Date();
    
    // Calcular tiempo transcurrido desde el último cuidado (en minutos)
    const minutesSinceFed = (now - this.lastFed) / (1000 * 60);
    const minutesSinceWatered = (now - this.lastWatered) / (1000 * 60);
    const minutesSincePlayed = (now - this.lastPlayed) / (1000 * 60);
    const minutesSinceWalked = (now - this.lastWalked) / (1000 * 60);
    const minutesSinceBathed = (now - this.lastBathed) / (1000 * 60);
    const minutesSinceSlept = (now - this.lastSlept) / (1000 * 60);
    const minutesSincePet = (now - this.lastPet) / (1000 * 60);
    
    // Degradación de hambre (aumenta con el tiempo)
    this.hunger = Math.min(100, this.hunger + (minutesSinceFed * this.hungerRate));
    
    // Degradación de energía (disminuye con el tiempo)
    this.energy = Math.max(0, this.energy - (minutesSinceFed * this.energyDecayRate));
    
    // Degradación de felicidad (disminuye con el tiempo)
    this.happiness = Math.max(0, this.happiness - (minutesSinceFed * this.happinessDecayRate));
    
    // Degradación de limpieza (disminuye con el tiempo)
    this.cleanliness = Math.max(0, this.cleanliness - (minutesSinceFed * this.cleanlinessDecayRate));
    
    // Degradación de sueño (aumenta con el tiempo)
    this.sleep = Math.min(100, this.sleep + (minutesSinceFed * this.sleepDecayRate));
    
    // Si está durmiendo, recuperar energía y reducir sueño
    if (this.isSleeping) {
        const sleepMinutes = (now - this.sleepStartTime) / (1000 * 60);
        this.energy = Math.min(100, this.energy + (sleepMinutes * 0.8)); // Recupera energía por minuto
        this.sleep = Math.max(0, this.sleep - (sleepMinutes * 1.0)); // Reduce sueño por minuto
    }
    
    // Consecuencias por negligencia
    if (this.hunger > 80 || this.cleanliness < 20 || this.happiness < 20) {
        this.health = Math.max(0, this.health - (minutesSinceFed * this.healthDecayRate));
    }
    
    // Consecuencias por sobrealimentación (hambre muy baja)
    if (this.hunger < 10) {
        this.health = Math.max(0, this.health - (minutesSinceFed * this.healthDecayRate * 0.5));
        if (this.hunger < 5 && !this.isSick) {
            this.isSick = true;
            this.sickness = 'Sobrepeso';
            this.sicknessStartTime = now;
            this.status = 'enferma';
        }
    }
    
    // Consecuencias por limpieza excesiva (muy limpia)
    if (this.cleanliness > 95) {
        this.happiness = Math.max(0, this.happiness - (minutesSinceFed * this.happinessDecayRate * 0.3));
    }
    
    // Consecuencias por energía excesiva (muy alta energía)
    if (this.energy > 95) {
        this.happiness = Math.max(0, this.happiness - (minutesSinceFed * this.happinessDecayRate * 0.2));
    }
    
    // Enfermedades por negligencia
    if (this.health < 30 && !this.isSick) {
        this.isSick = true;
        this.sickness = 'Desnutrición';
        this.sicknessStartTime = now;
        this.status = 'enferma';
    }
    
    // Enfermedades por sobrealimentación
    if (this.hunger < 5 && !this.isSick) {
        this.isSick = true;
        this.sickness = 'Sobrepeso';
        this.sicknessStartTime = now;
        this.status = 'enferma';
    }
    
    // Enfermedades por limpieza excesiva
    if (this.cleanliness > 98 && !this.isSick) {
        this.isSick = true;
        this.sickness = 'Piel Seca';
        this.sicknessStartTime = now;
        this.status = 'enferma';
    }
    
    // Enfermedades por estrés (mucha energía sin gastar)
    if (this.energy > 95 && this.happiness < 50 && !this.isSick) {
        this.isSick = true;
        this.sickness = 'Estrés';
        this.sicknessStartTime = now;
        this.status = 'enferma';
    }
    
    // Muerte por negligencia extrema
    if (this.health <= 0) {
        this.status = 'dead';
        this.deathDate = now;
        this.isSleeping = false;
        this.mood = 'dead';
    }
    
    // Muerte por hambre extrema (más de 95)
    if (this.hunger >= 95) {
        this.status = 'dead';
        this.deathDate = now;
        this.isSleeping = false;
        this.mood = 'dead';
    }
    
    // Muerte por enfermedad prolongada (más de 24 horas enferma)
    if (this.isSick && this.sicknessStartTime) {
        const sickHours = (now - this.sicknessStartTime) / (1000 * 60 * 60);
        if (sickHours > 24) {
            this.status = 'dead';
            this.deathDate = now;
            this.isSleeping = false;
            this.mood = 'dead';
        }
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
    
    if (this.hunger > 85) {
        this.mood = 'hungry';
        return;
    }
    
    if (this.cleanliness < 25) {
        this.mood = 'dirty';
        return;
    }
    
    if (this.energy < 15) {
        this.mood = 'tired';
        return;
    }
    
    if (this.sleep > 80) {
        this.mood = 'sleepy';
        return;
    }
    
    if (this.happiness > 80 && this.health > 80) {
        this.mood = 'excited';
        return;
    }
    
    if (this.happiness < 25) {
        this.mood = 'sad';
        return;
    }
    
    this.mood = 'happy';
};

// Método para alimentar
petSchema.methods.feed = function(foodType = 'regular') {
    if (this.status === 'dead' || this.mood === 'dead') return false;
    
    const now = new Date();
    this.lastFed = now;
    
    // Calcular cuánto alimentar basado en hambre actual
    let hungerReduction = 40;
    let healthIncrease = 10;
    let happinessIncrease = 15;
    
    // Si ya está muy llena, reducir beneficios
    if (this.hunger < 20) {
        hungerReduction = 20;
        healthIncrease = 5;
        happinessIncrease = 5;
    }
    
    // Si está sobrealimentada, consecuencias negativas
    if (this.hunger < 10) {
        hungerReduction = 10;
        healthIncrease = -5; // Reduce salud
        happinessIncrease = -10; // Reduce felicidad
    }
    
    this.hunger = Math.max(0, this.hunger - hungerReduction);
    this.happiness = Math.min(100, Math.max(0, this.happiness + happinessIncrease));
    this.health = Math.min(100, Math.max(0, this.health + healthIncrease));
    
    this.activityHistory.push({
        action: 'feed',
        date: now,
        food: foodType,
        effect: `Hambre -${hungerReduction}, Felicidad ${happinessIncrease > 0 ? '+' : ''}${happinessIncrease}, Salud ${healthIncrease > 0 ? '+' : ''}${healthIncrease}`
    });
    
    this.updateMood();
    return true;
};

// Método para dar agua
petSchema.methods.water = function(waterType = 'regular') {
    if (this.status === 'dead' || this.mood === 'dead') return false;
    
    const now = new Date();
    this.lastWatered = now;
    this.happiness = Math.min(100, this.happiness + 5);
    this.health = Math.min(100, this.health + 3);
    
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
    if (this.status === 'dead' || this.mood === 'dead' || this.energy < 10) return false;
    
    const now = new Date();
    this.lastPlayed = now;
    
    // Calcular efectos basados en energía actual
    let energyCost = 20;
    let happinessGain = 25;
    let hungerGain = 15;
    let cleanlinessLoss = 10;
    
    // Si está muy cansada, jugar es más difícil
    if (this.energy < 20) {
        energyCost = 25;
        happinessGain = 15;
        hungerGain = 20;
        cleanlinessLoss = 15;
    }
    
    // Si tiene mucha energía, puede jugar más intensamente
    if (this.energy > 80) {
        energyCost = 15;
        happinessGain = 30;
        hungerGain = 10;
        cleanlinessLoss = 8;
    }
    
    // Si está muy sucia, jugar la ensucia más
    if (this.cleanliness < 30) {
        cleanlinessLoss += 5;
    }
    
    this.energy = Math.max(0, this.energy - energyCost);
    this.happiness = Math.min(100, this.happiness + happinessGain);
    this.hunger = Math.min(100, this.hunger + hungerGain);
    this.cleanliness = Math.max(0, this.cleanliness - cleanlinessLoss);
    
    this.activityHistory.push({
        action: 'play',
        date: now,
        effect: `Energía -${energyCost}, Felicidad +${happinessGain}, Hambre +${hungerGain}, Limpieza -${cleanlinessLoss}`
    });
    
    this.updateMood();
    return true;
};

// Método para pasear
petSchema.methods.walk = function() {
    if (this.status === 'dead' || this.mood === 'dead' || this.energy < 20) return false;
    
    const now = new Date();
    this.lastWalked = now;
    this.energy = Math.max(0, this.energy - 20);
    this.happiness = Math.min(100, this.happiness + 15);
    this.hunger = Math.min(100, this.hunger + 15);
    this.cleanliness = Math.max(0, this.cleanliness - 5);
    
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
    if (this.status === 'dead' || this.mood === 'dead') return false;
    
    const now = new Date();
    this.lastBathed = now;
    
    // Calcular efectos basados en limpieza actual
    let cleanlinessGain = 100;
    let happinessGain = 10;
    
    // Si ya está muy limpia, bañarla es menos efectivo
    if (this.cleanliness > 80) {
        cleanlinessGain = 20;
        happinessGain = 5;
    }
    
    // Si está muy sucia, el baño es más efectivo
    if (this.cleanliness < 30) {
        cleanlinessGain = 100;
        happinessGain = 20;
    }
    
    // Si está muy limpia, bañarla puede ser molesto
    if (this.cleanliness > 90) {
        happinessGain = -5; // Reduce felicidad
    }
    
    this.cleanliness = Math.min(100, this.cleanliness + cleanlinessGain);
    this.happiness = Math.min(100, Math.max(0, this.happiness + happinessGain));
    
    this.activityHistory.push({
        action: 'bath',
        date: now,
        effect: `Limpieza +${cleanlinessGain}, Felicidad ${happinessGain > 0 ? '+' : ''}${happinessGain}`
    });
    
    this.updateMood();
    return true;
};

// Método para dormir
petSchema.methods.startSleep = function() {
    if (this.status === 'dead' || this.mood === 'dead' || this.isSleeping) return false;
    
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
    if (this.status === 'dead' || this.mood === 'dead' || !this.isSleeping) return false;
    
    const now = new Date();
    this.isSleeping = false;
    
    // Calcular tiempo dormido y recuperar stats
    const sleepMinutes = (now - this.sleepStartTime) / (1000 * 60);
    this.energy = Math.min(100, this.energy + (sleepMinutes * 0.8)); // Recupera energía por minuto
    this.sleep = Math.max(0, this.sleep - (sleepMinutes * 1.0)); // Reduce sueño por minuto
    
    this.activityHistory.push({
        action: 'wake',
        date: now,
        duration: sleepMinutes,
        effect: `Energía +${Math.floor(sleepMinutes * 0.8)}, Sueño -${Math.floor(sleepMinutes * 1.0)}`
    });
    
    this.updateMood();
    return true;
};

// Método para acariciar
petSchema.methods.pet = function() {
    if (this.status === 'dead' || this.mood === 'dead') return false;
    
    const now = new Date();
    this.lastPet = now;
    
    // Calcular efectos basados en estado actual
    let happinessGain = 15;
    let healthGain = 3;
    
    // Si está muy feliz, acariciarla es menos efectivo
    if (this.happiness > 80) {
        happinessGain = 8;
        healthGain = 2;
    }
    
    // Si está triste, acariciarla es más efectivo
    if (this.happiness < 30) {
        happinessGain = 25;
        healthGain = 5;
    }
    
    // Si está enferma, acariciarla ayuda más
    if (this.isSick) {
        happinessGain = 20;
        healthGain = 8;
    }
    
    // Si está durmiendo, acariciarla la despierta
    if (this.isSleeping) {
        this.isSleeping = false;
        happinessGain = 10;
        healthGain = 2;
    }
    
    this.happiness = Math.min(100, this.happiness + happinessGain);
    this.health = Math.min(100, this.health + healthGain);
    
    this.activityHistory.push({
        action: 'pet',
        date: now,
        effect: `Felicidad +${happinessGain}, Salud +${healthGain}${this.isSleeping ? ', Despertó' : ''}`
    });
    
    this.updateMood();
    return true;
};

// Método para curar
petSchema.methods.heal = function() {
    if (this.status === 'dead' || this.mood === 'dead') return false;
    
    const now = new Date();
    this.lastHealed = now;
    
    // Calcular efectos de curación basados en enfermedad
    let healthGain = 30;
    let canCure = false;
    
    if (this.isSick) {
        switch (this.sickness) {
            case 'Desnutrición':
                healthGain = 40;
                canCure = true;
                break;
            case 'Sobrepeso':
                healthGain = 25;
                canCure = true;
                break;
            case 'Piel Seca':
                healthGain = 20;
                canCure = true;
                break;
            case 'Estrés':
                healthGain = 35;
                canCure = true;
                break;
            default:
                healthGain = 30;
                canCure = true;
        }
    }
    
    this.health = Math.min(100, this.health + healthGain);
    
    if (canCure && this.isSick) {
        this.isSick = false;
        this.sickness = null;
        this.sicknessStartTime = null;
        this.status = 'viva';
    }
    
    this.activityHistory.push({
        action: 'heal',
        date: now,
        effect: `Salud +${healthGain}${canCure ? ', Enfermedad curada' : ''}`
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