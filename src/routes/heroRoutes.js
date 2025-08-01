import express from 'express';
import { check, validationResult } from 'express-validator';
import { getAllHeroes, addHero, getHeroById, updateHero, deleteHero } from '../controllers/heroController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Validaciones para crear héroe
const createHeroValidation = [
    check('name')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 1, max: 50 }).withMessage('El nombre debe tener entre 1 y 50 caracteres')
        .trim(),
    check('alias')
        .notEmpty().withMessage('El alias es requerido')
        .isLength({ min: 1, max: 50 }).withMessage('El alias debe tener entre 1 y 50 caracteres')
        .trim(),
    check('city')
        .optional()
        .isLength({ max: 100 }).withMessage('La ciudad no puede tener más de 100 caracteres')
        .trim(),
    check('team')
        .optional()
        .isLength({ max: 100 }).withMessage('El equipo no puede tener más de 100 caracteres')
        .trim(),
    check('type')
        .optional()
        .isLength({ max: 50 }).withMessage('El tipo no puede tener más de 50 caracteres')
        .trim(),
    check('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('El color debe ser un código hexadecimal válido (ej: #FF0000)'),
    check('personality')
        .optional()
        .isLength({ max: 200 }).withMessage('La personalidad no puede tener más de 200 caracteres')
        .trim(),
    check('accessories')
        .optional()
        .isArray().withMessage('Los accesorios deben ser un array'),
    check('avatar')
        .optional()
        .isURL().withMessage('El avatar debe ser una URL válida')
        .trim()
];

// Validaciones para actualizar héroe
const updateHeroValidation = [
    check('name')
        .optional()
        .isLength({ min: 1, max: 50 }).withMessage('El nombre debe tener entre 1 y 50 caracteres')
        .trim(),
    check('alias')
        .optional()
        .isLength({ min: 1, max: 50 }).withMessage('El alias debe tener entre 1 y 50 caracteres')
        .trim(),
    check('city')
        .optional()
        .isLength({ max: 100 }).withMessage('La ciudad no puede tener más de 100 caracteres')
        .trim(),
    check('team')
        .optional()
        .isLength({ max: 100 }).withMessage('El equipo no puede tener más de 100 caracteres')
        .trim(),
    check('avatar')
        .optional()
        .isURL().withMessage('El avatar debe ser una URL válida')
        .trim(),
    check('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('El color debe ser un código hexadecimal válido (ej: #FF0000)')
];

// Rutas de héroes
router.get('/', authMiddleware, getAllHeroes);
router.post('/', authMiddleware, createHeroValidation, addHero);
router.get('/:id', authMiddleware, getHeroById);
router.put('/:id', authMiddleware, updateHeroValidation, updateHero);
router.delete('/:id', authMiddleware, deleteHero);

export default router; 