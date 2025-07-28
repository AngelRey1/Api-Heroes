import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado. Debes enviar el header Authorization: Bearer <token>' });
  }
  // Solo aceptar formato Bearer <token>
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Formato de token inválido. Usa Authorization: Bearer <token>' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded);
    const user = await User.findById(decoded.userId);
    console.log('Usuario encontrado:', user ? user.username : 'null');
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado para el token proporcionado.' });
    }
    if (user.activo === false) {
      return res.status(401).json({ error: 'Usuario inactivo. No autorizado.' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Por favor, inicia sesión nuevamente.' });
    }
    res.status(401).json({ error: 'Token inválido. Verifica que el token sea correcto y no esté alterado.' });
  }
} 