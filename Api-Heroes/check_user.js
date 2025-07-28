import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/userModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    const userId = "6882f081b5d9ccbaba711afd";
    const user = await User.findById(userId);
    
    if (user) {
      console.log('Usuario encontrado:', {
        id: user._id,
        username: user.username,
        email: user.email,
        activo: user.activo
      });
    } else {
      console.log('Usuario no encontrado con ID:', userId);
      
      // Buscar todos los usuarios
      const allUsers = await User.find({});
      console.log('Usuarios en la base de datos:', allUsers.map(u => ({ id: u._id, username: u.username })));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser(); 