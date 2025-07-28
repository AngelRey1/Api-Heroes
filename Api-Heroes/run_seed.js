import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/userModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createDemoUser() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    // Verificar si el usuario demo ya existe
    const existingUser = await User.findOne({ username: 'demo' });
    if (existingUser) {
      console.log('Usuario demo ya existe. Actualizando contraseña...');
      const hashedPassword = await bcrypt.hash('demo123', 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log('Contraseña del usuario demo actualizada.');
    } else {
      console.log('Creando usuario demo...');
      const hashedPassword = await bcrypt.hash('demo123', 10);
      await User.create({
        username: 'demo',
        email: 'demo@email.com',
        password: hashedPassword,
        coins: 200
      });
      console.log('Usuario demo creado exitosamente.');
    }

    console.log('Credenciales de prueba:');
    console.log('- Username: demo');
    console.log('- Password: demo123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createDemoUser(); 