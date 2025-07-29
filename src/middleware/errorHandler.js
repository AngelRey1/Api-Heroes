import { ValidationError, AuthorizationError, NotFoundError, PetCareError } from '../utils/errors.js';

// Middleware global para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Errores de validación
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message,
      type: 'VALIDATION_ERROR',
      details: err.details || null
    });
  }

  // Errores de autorización
  if (err instanceof AuthorizationError) {
    return res.status(403).json({
      error: err.message,
      type: 'AUTHORIZATION_ERROR'
    });
  }

  // Errores de recurso no encontrado
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.message,
      type: 'NOT_FOUND_ERROR'
    });
  }

  // Errores específicos del cuidado de mascotas
  if (err instanceof PetCareError) {
    return res.status(err.status || 400).json({
      error: err.message,
      type: 'PET_CARE_ERROR'
    });
  }

  // Errores de MongoDB
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación de datos',
      type: 'MONGOOSE_VALIDATION_ERROR',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      type: 'MONGOOSE_CAST_ERROR'
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Dato duplicado',
      type: 'MONGOOSE_DUPLICATE_ERROR',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      type: 'JWT_ERROR'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      type: 'JWT_EXPIRED_ERROR'
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: message,
    type: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para capturar errores asíncronos
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware para validar ObjectId
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      error: 'ID inválido',
      type: 'INVALID_ID_ERROR'
    });
  }
  next();
}; 