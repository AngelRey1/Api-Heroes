import express from 'express';
import heroController from './src/controllers/heroController.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import petController from './src/controllers/petController.js';
import petCareController from './src/controllers/petCareController.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authController from './src/controllers/authController.js';
import cors from 'cors';
// Nuevas rutas
import itemRoutes from './src/routes/itemRoutes.js';
import achievementRoutes from './src/routes/achievementRoutes.js';
import minigameRoutes from './src/routes/minigameRoutes.js';
import shopRoutes from './src/routes/shopRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import missionRoutes from './src/routes/missionRoutes.js';

dotenv.config();

const app = express();

// Habilitar CORS para todos los orígenes
app.use(cors());

// Configuración Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Superhéroes y Mascotas',
    version: '1.0.0',
    description: 'Documentación de la API de superhéroes y mascotas',
  },
  servers: [
    {
      url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3001',
      description: 'Servidor de Producción o Desarrollo',
    },
  ],
  tags: [
    { name: 'Autenticación', description: 'Registro e inicio de sesión de jugadores' },
    { name: 'Superhéroes', description: 'Operaciones sobre superhéroes' },
    { name: 'Mascotas', description: 'Operaciones sobre mascotas' },
    { name: 'Cuidado de Mascota', description: 'Operaciones de cuidado tipo Pou' },
    { name: 'Items', description: 'Objetos, accesorios, comida, etc.' },
    { name: 'Logros', description: 'Logros y recompensas' },
    { name: 'Minijuegos', description: 'Minijuegos y records' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce tu token JWT aquí para autenticarte.'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/*.js'], // Incluye todos los controladores
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

// Conexión a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

app.use('/api', heroController);
app.use('/api/pets', petController);
app.use('/api/pet-care', petCareController);
app.use('/api/auth', authController);
// Nuevas rutas
app.use('/api/items', itemRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/minigames', minigameRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/missions', missionRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Swagger docs en http://localhost:${PORT}/api-docs`);
    console.log('Presiona Ctrl+C para detener el servidor');
}); 