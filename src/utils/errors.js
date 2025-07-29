// Clase para errores personalizados del sistema de mascotas
export class PetCareError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        this.name = 'PetCareError';
    }
}

// Clase para errores de autorización
export class AuthorizationError extends Error {
    constructor(message = 'No tienes permisos para realizar esta acción') {
        super(message);
        this.status = 403;
        this.name = 'AuthorizationError';
    }
}

// Clase para errores de validación
export class ValidationError extends Error {
    constructor(message = 'Datos de entrada inválidos') {
        super(message);
        this.status = 400;
        this.name = 'ValidationError';
    }
}

// Clase para errores de recurso no encontrado
export class NotFoundError extends Error {
    constructor(message = 'Recurso no encontrado') {
        super(message);
        this.status = 404;
        this.name = 'NotFoundError';
    }
}

// Función helper para manejar errores en controladores
export function handleError(error, res) {
    console.error('Error:', error);
    
    if (error instanceof PetCareError || 
        error instanceof AuthorizationError || 
        error instanceof ValidationError || 
        error instanceof NotFoundError) {
        return res.status(error.status).json({ error: error.message });
    }
    
    // Para errores con formato [object Object] { status, message }
    if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message });
    }
    
    // Error genérico
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
} 