import express from 'express';
import heroController from './src/controllers/heroController.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import petController from './src/controllers/petController.js';
import petCareController from './src/controllers/petCareController.js';

const app = express();

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
      url: 'http://localhost:3001',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/*.js'], // Incluye todos los controladores
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/api', heroController);
app.use('/api/pets', petController);
app.use('/api/pet-care', petCareController);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Swagger docs en http://localhost:${PORT}/api-docs`);
    console.log('Presiona Ctrl+C para detener el servidor');
}); 