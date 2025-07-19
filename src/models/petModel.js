import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: { type: String, required: true, description: 'Nombre de la mascota' },
    type: { type: String, required: true, description: 'Tipo de mascota (perro, gato, etc.)' },
    superPower: { type: String, description: 'Superpoder especial de la mascota' },
    adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero', default: null, description: 'ID del héroe que adoptó la mascota' },
    adoptionHistory: [{
        hero: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero', description: 'ID del héroe que adoptó' },
        date: { type: Date, default: Date.now, description: 'Fecha de adopción' },
        reason: { type: String, description: 'Motivo de adopción' },
        notes: { type: String, description: 'Notas adicionales' }
    }],
    status: { type: String, default: 'available', description: 'Estado de la mascota (available, adopted, returned, dead)' },
    health: { type: Number, default: 100, description: 'Nivel de salud (0-100)' },
    happiness: { type: Number, default: 100, description: 'Nivel de felicidad (0-100)' },
    personality: { type: String, default: 'neutral', description: 'Personalidad de la mascota' },
    activityHistory: [{
        action: { type: String, description: 'Acción realizada (feed, walk, play, bath, heal, sick, customize)' },
        date: { type: Date, default: Date.now, description: 'Fecha de la acción' },
        notes: { type: String, description: 'Notas de la acción' },
        // Campos adicionales según la acción
        food: { type: String, description: 'Tipo de comida (solo para feed)' },
        disease: { type: String, description: 'Enfermedad (solo para sick/heal)' },
        item: { type: String, description: 'Item de customización (solo para customize)' },
        type: { type: String, description: 'Tipo de customización (solo para customize)' }
    }],
    customization: {
        type: {
            free: [{ type: String, description: 'Objetos de customización gratuitos' }],
            paid: [{ type: String, description: 'Objetos de customización de pago' }]
        },
        default: { free: [], paid: [] }
    },
    diseases: [{ type: String, description: 'Enfermedades activas' }],
    lastCare: { type: Date, default: null, description: 'Fecha del último cuidado' },
    deathDate: { type: Date, default: null, description: 'Fecha de muerte' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, description: 'Propietario de la mascota (jugador)' }
});

petSchema.method('toJSON', function() {
    const { _id, __v, ...object } = this.toObject();
    object._id = _id;
    object.id_corto = _id.toString().substring(0, 8);
    return object;
});

export default mongoose.model('Pet', petSchema); 