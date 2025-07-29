import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener customizaciones de mascotas
router.get('/pets', authMiddleware, async (req, res) => {
  try {
    // Por ahora devolvemos datos de ejemplo
    const petCustomizations = [
      {
        _id: '1',
        name: 'Sombrero de Vaquero',
        description: 'Un sombrero elegante para tu mascota',
        category: 'hats',
        rarity: 'common',
        price: 50,
        owned: true,
        applied: false,
        image: '/assets/sombrero.svg'
      },
      {
        _id: '2',
        name: 'Gafas de Sol',
        description: 'Gafas cool para tu mascota',
        category: 'accessories',
        rarity: 'rare',
        price: 100,
        owned: false,
        applied: false,
        image: null
      }
    ];
    
    res.json(petCustomizations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener customizaciones de mascotas' });
  }
});

// Obtener customizaciones de héroes
router.get('/heroes', authMiddleware, async (req, res) => {
  try {
    // Por ahora devolvemos datos de ejemplo
    const heroCustomizations = [
      {
        _id: '1',
        name: 'Capa de Superhéroe',
        description: 'Una capa épica para tu héroe',
        category: 'capes',
        rarity: 'epic',
        price: 200,
        owned: true,
        applied: false,
        image: null
      },
      {
        _id: '2',
        name: 'Máscara de Lucha',
        description: 'Máscara protectora para tu héroe',
        category: 'masks',
        rarity: 'legendary',
        price: 500,
        owned: false,
        applied: false,
        image: null
      }
    ];
    
    res.json(heroCustomizations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener customizaciones de héroes' });
  }
});

// Aplicar customización de mascota
router.post('/pets/:customizationId/apply', authMiddleware, async (req, res) => {
  try {
    const { customizationId } = req.params;
    const userId = req.user.userId;
    
    // Aquí implementarías la lógica para aplicar la customización
    res.json({ message: 'Customización aplicada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al aplicar customización' });
  }
});

// Aplicar customización de héroe
router.post('/heroes/:customizationId/apply', authMiddleware, async (req, res) => {
  try {
    const { customizationId } = req.params;
    const userId = req.user.userId;
    
    // Aquí implementarías la lógica para aplicar la customización
    res.json({ message: 'Customización aplicada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al aplicar customización' });
  }
});

// Comprar customización
router.post('/:customizationId/buy', authMiddleware, async (req, res) => {
  try {
    const { customizationId } = req.params;
    const userId = req.user.userId;
    
    // Aquí implementarías la lógica para comprar la customización
    res.json({ message: 'Customización comprada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al comprar customización' });
  }
});

export default router; 