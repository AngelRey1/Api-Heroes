import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, description: 'Nombre de usuario único' },
  email: { type: String, required: true, unique: true, description: 'Correo electrónico del usuario' },
  password: { type: String, required: true, description: 'Contraseña encriptada' },
  displayName: { type: String, description: 'Nombre para mostrar (opcional)' },
  avatar: { type: String, description: 'URL del avatar (opcional)' },
  activo: { type: Boolean, default: true, description: 'Indica si el usuario está activo' }
});

userSchema.method('toJSON', function() {
  const { password, __v, ...object } = this.toObject();
  return object;
});

export default mongoose.model('User', userSchema); 