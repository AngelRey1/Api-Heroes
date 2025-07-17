import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    name: { type: String, required: true, description: 'Nombre real del superhéroe' },
    alias: { type: String, required: true, description: 'Nombre de superhéroe o alias' },
    city: { type: String, description: 'Ciudad donde opera el héroe' },
    team: { type: String, description: 'Equipo o grupo al que pertenece' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, description: 'Propietario del héroe (jugador)' },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet', description: 'Mascotas adoptadas por el héroe' }]
});

heroSchema.method('toJSON', function() {
    const { _id, __v, pets, ...object } = this.toObject();
    object._id = _id;
    object.id_corto = _id.toString().substring(0, 8);
    object.pets = pets; // Asegura que pets siempre esté presente
    return object;
});

export default mongoose.model('Hero', heroSchema);
