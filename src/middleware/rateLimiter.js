import rateLimit from 'express-rate-limit';

// Rate limiter general para toda la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos',
    type: 'RATE_LIMIT_ERROR'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter más estricto para autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por ventana
  message: {
    error: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos',
    type: 'AUTH_RATE_LIMIT_ERROR'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para creación de recursos
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 creaciones por minuto
  message: {
    error: 'Demasiadas creaciones de recursos, intenta de nuevo en 1 minuto',
    type: 'CREATE_RATE_LIMIT_ERROR'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para operaciones de cuidado de mascotas
export const petCareLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // máximo 30 acciones de cuidado por minuto
  message: {
    error: 'Demasiadas acciones de cuidado de mascotas, intenta de nuevo en 1 minuto',
    type: 'PET_CARE_RATE_LIMIT_ERROR'
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 