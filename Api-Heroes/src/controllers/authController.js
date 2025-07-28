import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Hero from '../models/heroModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * Registrar un nuevo usuario
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ error: 'El usuario o email ya existe.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    // Crear héroe automáticamente
    const hero = await Hero.create({
      name: username,
      alias: username,
      owner: user._id,
      city: '',
      team: '',
      pets: []
    });
    res.status(201).json({ message: 'Usuario y héroe registrados correctamente', user, hero });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Iniciar sesión de usuario
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 