import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/userModel.js';
import Item from './src/models/itemModel.js';
import Achievement from './src/models/achievementModel.js';
import Mission from './src/models/missionModel.js';
import Hero from './src/models/heroModel.js';
import Pet from './src/models/petModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Conectado a MongoDB');

  // Limpiar colecciones
  await User.deleteMany({});
  await Item.deleteMany({});
  await Achievement.deleteMany({});
  await Mission.deleteMany({});
  await Hero.deleteMany({});
  await Pet.deleteMany({});

  // Crear items
  const items = await Item.insertMany([
    { name: 'Comida básica', type: 'food', effect: { health: 10 }, price: 5, image: '', target: 'pet' },
    { name: 'Juguete divertido', type: 'toy', effect: { happiness: 15 }, price: 10, image: '', target: 'pet' },
    { name: 'Medicina', type: 'medicine', effect: { health: 30 }, price: 20, image: '', target: 'pet' },
    { name: 'Capa de héroe', type: 'accessory', effect: {}, price: 50, image: '', target: 'hero' }
  ]);

  // Crear logros
  const achievements = await Achievement.insertMany([
    { name: 'Primer mascota', description: 'Adopta tu primera mascota', criteria: 'adopt_pet', reward: { coins: 50 } },
    { name: 'Cuida bien', description: 'Alcanza 100 de salud en una mascota', criteria: 'pet_health_100', reward: { itemId: items[2]._id } },
    { name: 'Jugador activo', description: 'Juega 7 días seguidos', criteria: 'login_streak_7', reward: { coins: 100 } },
    { name: 'Logro secreto', description: 'Descubre el secreto', criteria: 'secret', reward: { coins: 200 }, secret: true }
  ]);

  // Crear misiones
  const missions = await Mission.insertMany([
    { userId: null, type: 'daily', title: 'Alimenta a tu mascota', description: 'Dale de comer a tu mascota', progress: 0, goal: 1, completed: false, claimed: false, reward: { coins: 10 } },
    { userId: null, type: 'daily', title: 'Juega con tu mascota', description: 'Haz feliz a tu mascota', progress: 0, goal: 1, completed: false, claimed: false, reward: { coins: 10 } },
    { userId: null, type: 'weekly', title: 'Gana 5 minijuegos', description: 'Gana 5 veces en minijuegos', progress: 0, goal: 5, completed: false, claimed: false, reward: { coins: 50 } }
  ]);

  // Crear usuario de prueba
  const user = await User.create({
    username: 'demo',
    email: 'demo@email.com',
    password: 'hashedpassword', // Recuerda cambiar por un hash real en producción
    coins: 200,
    inventory: [
      { itemId: items[0]._id, quantity: 5 },
      { itemId: items[1]._id, quantity: 2 }
    ],
    achievements: [achievements[0]._id],
    missions: [missions[0]._id, missions[1]._id],
    highScores: [],
    pets: [],
    heroes: []
  });

  // Crear héroe y mascota de ejemplo
  const hero = await Hero.create({
    name: 'Chapulín Colorado',
    alias: 'Chapulín',
    city: 'CDMX',
    team: 'Independiente',
    owner: user._id,
    pets: []
  });
  const pet = await Pet.create({
    name: 'Krypto',
    type: 'Perro',
    superPower: 'Vuelo',
    adoptedBy: hero._id,
    status: 'available',
    health: 100,
    happiness: 100,
    owner: user._id
  });

  // Relacionar héroe y mascota con el usuario
  user.pets.push(pet._id);
  user.heroes.push(hero._id);
  await user.save();
  hero.pets.push(pet._id);
  await hero.save();

  console.log('Datos de ejemplo insertados correctamente.');
  process.exit();
}

seed().catch(e => { console.error(e); process.exit(1); }); 