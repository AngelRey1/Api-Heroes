import mongoose from 'mongoose';
// Validar que un ID sea un ObjectId válido de MongoDB
export function validateObjectId(id, fieldName = 'ID') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError(`${fieldName} inválido`);
    }
}

// Validar que un ID sea un ObjectId válido y lanzar error si no lo es
export function validateAndThrowObjectId(id, resourceName = 'recurso') {
    if (!validateObjectId(id)) {
        throw new ValidationError(`ID de ${resourceName} inválido`);
    }
}

// Validar que un valor esté dentro de un rango
export function validateRange(value, min, max, fieldName) {
    if (value < min || value > max) {
        throw new ValidationError(`${fieldName} debe estar entre ${min} y ${max}`);
    }
}

// Validar que un string no esté vacío
export function validateRequiredString(value, fieldName) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
        throw new ValidationError(`${fieldName} es requerido`);
    }
}

// Validar que un array no esté vacío
export function validateRequiredArray(value, fieldName) {
    if (!Array.isArray(value) || value.length === 0) {
        throw new ValidationError(`${fieldName} debe ser un array no vacío`);
    }
}

// Validar estados de mascota válidos
export const VALID_PET_STATUSES = ['available', 'adopted', 'returned'];
export function validatePetStatus(status) {
    if (!VALID_PET_STATUSES.includes(status)) {
        throw new ValidationError(`Estado de mascota inválido. Estados válidos: ${VALID_PET_STATUSES.join(', ')}`);
    }
}

// Validar personalidades de mascota válidas
export const VALID_PET_PERSONALITIES = ['neutral', 'juguetón', 'perezoso', 'agresivo', 'tímido'];
export function validatePetPersonality(personality) {
    if (!VALID_PET_PERSONALITIES.includes(personality)) {
        throw new ValidationError(`Personalidad inválida. Personalidades válidas: ${VALID_PET_PERSONALITIES.join(', ')}`);
    }
}

// Validar tipos de customización válidos
export const VALID_CUSTOMIZATION_TYPES = ['free'];
export function validateCustomizationType(type) {
    if (!VALID_CUSTOMIZATION_TYPES.includes(type)) {
        throw new ValidationError(`Tipo de customización inválido. Tipos válidos: ${VALID_CUSTOMIZATION_TYPES.join(', ')}`);
    }
}

// Validar que un string tenga una longitud mínima y máxima
export function validateStringLength(value, min, max, fieldName) {
    if (typeof value !== 'string' || value.length < min || value.length > max) {
        throw new ValidationError(`${fieldName} debe tener entre ${min} y ${max} caracteres`);
    }
}

// Validar que un objeto tenga todos los campos requeridos no vacíos
export function validateRequiredFields(obj, fields) {
    for (const field of fields) {
        if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
            throw new ValidationError(`El campo '${field}' es requerido`);
        }
    }
}

// Importar las clases de error
import { ValidationError } from './errors.js'; 