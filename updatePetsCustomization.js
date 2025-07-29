import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Pet from './src/models/petModel.js';

async function updateCustomization() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const result = await Pet.updateMany(
      { $or: [ { customization: { $exists: false } }, { customization: null } ] },
      { $set: { customization: { free: [], paid: [] } } }
    );
    console.log(`Mascotas actualizadas: ${result.modifiedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error actualizando mascotas:', err);
    process.exit(1);
  }
}

updateCustomization(); 