import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// Rutas
import heroRoutes from './Api-Heroes/src/routes/heroRoutes.js';
import petRoutes from './Api-Heroes/src/routes/petRoutes.js';
import petCareRoutes from './Api-Heroes/src/routes/petCareRoutes.js';
import authRoutes from './Api-Heroes/src/routes/authRoutes.js';
import itemRoutes from './Api-Heroes/src/routes/itemRoutes.js';
import achievementRoutes from './Api-Heroes/src/routes/achievementRoutes.js';
import minigameRoutes from './Api-Heroes/src/routes/minigameRoutes.js';
import shopRoutes from './Api-Heroes/src/routes/shopRoutes.js';
import inventoryRoutes from './Api-Heroes/src/routes/inventoryRoutes.js';
import userRoutes from './Api-Heroes/src/routes/userRoutes.js';
import notificationRoutes from './Api-Heroes/src/routes/notificationRoutes.js';
import eventRoutes from './Api-Heroes/src/routes/eventRoutes.js';
import friendRoutes from './Api-Heroes/src/routes/friendRoutes.js';
import chatRoutes from './Api-Heroes/src/routes/chatRoutes.js';
import missionRoutes from './Api-Heroes/src/routes/missionRoutes.js';
import cron from 'node-cron';
import Pet from './Api-Heroes/src/models/petModel.js';
import petCareService from './Api-Heroes/src/services/petCareService.js';
import achievementService from './Api-Heroes/src/services/achievementService.js';
import missionService from './Api-Heroes/src/services/missionService.js';
import eventService from './Api-Heroes/src/services/eventService.js';
import minigameService from './Api-Heroes/src/services/minigameService.js';
import http from 'http';
import socketManager from './Api-Heroes/src/socket/socketManager.js';
import notificationService from './Api-Heroes/src/services/notificationService.js';
import tournamentRoutes from './Api-Heroes/src/routes/tournamentRoutes.js';
import tournamentService from './Api-Heroes/src/services/tournamentService.js';
import secretAchievementRoutes from './Api-Heroes/src/routes/secretAchievementRoutes.js';
import secretAchievementService from './Api-Heroes/src/services/secretAchievementService.js';
import statisticsRoutes from './Api-Heroes/src/routes/statisticsRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Inicializar Socket.IO
const io = socketManager.initializeSocket(server);

// Configuración de CORS más específica
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tu-app.onrender.com',
    'https://api-heroes-gh4i.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
  apis: ['./Api-Heroes/src/controllers/*.js'], // Incluye todos los controladores
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

// Rutas
app.use('/api/heroes', heroRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/pet-care', petCareRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/minigames', minigameRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/secret-achievements', secretAchievementRoutes);
app.use('/api/statistics', statisticsRoutes);

// Inicializar logros por defecto
achievementService.initializeAchievements().then(() => {
  console.log('[APP] Logros inicializados correctamente');
  return secretAchievementService.initializeSecretAchievements();
}).then(() => {
  console.log('[APP] Logros secretos inicializados');
}).catch(error => {
  console.error('[APP] Error inicializando logros:', error);
});

// Inicializar minijuegos por defecto
minigameService.initializeMinigames().then(() => {
  console.log('[APP] Minijuegos inicializados correctamente');
}).catch(err => {
  console.error('[APP] Error inicializando minijuegos:', err);
});

// Cron job: cada hora degrada stats de todas las mascotas
cron.schedule('0 * * * *', async () => {
  try {
    const pets = await Pet.find({ status: { $ne: 'dead' } });
    for (const pet of pets) {
      // Degrada stats por 1 hora
      await petCareService.decayPetStats(pet._id, 1, pet.owner);
    }
    console.log(`[CRON] Degradación automática de mascotas ejecutada (${pets.length} mascotas)`);
  } catch (err) {
    console.error('[CRON] Error en degradación automática de mascotas:', err);
  }
});

// Cron job: cada día a las 00:00 renueva las misiones diarias
cron.schedule('0 0 * * *', async () => {
  try {
    const renewedCount = await missionService.renewDailyMissions();
    console.log(`[CRON] Misiones diarias renovadas (${renewedCount} usuarios)`);
  } catch (err) {
    console.error('[CRON] Error renovando misiones diarias:', err);
  }
});

// Cron job: cada hora programa eventos automáticos
cron.schedule('0 * * * *', async () => {
  try {
    await eventService.scheduleEvents();
    console.log('[CRON] Eventos programados automáticamente');
  } catch (err) {
    console.error('[CRON] Error programando eventos:', err);
  }
});

// Cron job: limpiar notificaciones expiradas cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await notificationService.cleanupExpiredNotifications();
    console.log('[CRON] Notificaciones expiradas limpiadas');
  } catch (error) {
    console.error('[CRON] Error limpiando notificaciones:', error);
  }
});

// Cron job: programar torneos automáticos cada día a las 00:00
cron.schedule('0 0 * * *', async () => {
  try {
    await tournamentService.scheduleAutomaticTournaments();
    console.log('[CRON] Torneos automáticos programados');
  } catch (error) {
    console.error('[CRON] Error programando torneos:', error);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 