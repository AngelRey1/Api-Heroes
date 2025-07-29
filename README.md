# API Superhéroes y Mascotas 🦸‍♂️🐕

API REST completa para gestionar superhéroes y sus mascotas, con funcionalidades de juego tipo Tamagotchi/Pou.

## 🚀 Características

- **Gestión de Superhéroes**: CRUD completo para héroes
- **Gestión de Mascotas**: CRUD completo para mascotas con sistema de cuidado
- **Sistema de Adopción**: Los héroes pueden adoptar mascotas
- **Documentación Swagger**: API completamente documentada
- **Validación de Datos**: Validación de entrada con express-validator
- **Arquitectura MVC**: Separación clara de responsabilidades
- **Sistema de Logros**: Logros y recompensas
- **Minijuegos**: Varios minijuegos integrados
- **Sistema de Amigos**: Funcionalidades sociales
- **Chat en Tiempo Real**: Comunicación entre usuarios
- **Torneos**: Sistema competitivo
- **Notificaciones**: Sistema de notificaciones push
- **Rate Limiting**: Protección contra abuso
- **Manejo de Errores**: Sistema robusto de manejo de errores

## 📋 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Superhéroes
- `GET /api/heroes` - Listar todos los héroes
- `POST /api/heroes` - Crear nuevo héroe
- `GET /api/heroes/city/{city}` - Buscar héroes por ciudad
- `POST /api/heroes/{id}/enfrentar` - Enfrentar héroe con villano
- `GET /api/heroes/{id}/pets` - Ver mascotas de un héroe
- `PUT /api/heroes/{id}` - Actualizar héroe
- `DELETE /api/heroes/{id}` - Eliminar héroe

### Mascotas
- `GET /api/pets` - Listar todas las mascotas
- `POST /api/pets` - Crear nueva mascota
- `GET /api/pets/{id}` - Obtener mascota por ID
- `PUT /api/pets/{id}` - Actualizar mascota
- `DELETE /api/pets/{id}` - Eliminar mascota

### Cuidado de Mascotas
- `POST /api/pet-care/{id}/feed` - Alimentar mascota
- `POST /api/pet-care/{id}/sleep` - Dormir mascota
- `POST /api/pet-care/{id}/bath` - Bañar mascota
- `POST /api/pet-care/{id}/play` - Jugar con mascota
- `POST /api/pet-care/{id}/customize` - Personalizar mascota

### Otros Endpoints
- `GET /api/items` - Listar items
- `GET /api/achievements` - Listar logros
- `GET /api/minigames` - Listar minijuegos
- `GET /api/shop` - Tienda
- `GET /api/inventory` - Inventario
- `GET /api/friends` - Sistema de amigos
- `GET /api/chat` - Chat
- `GET /api/tournaments` - Torneos
- `GET /api/events` - Eventos
- `GET /api/missions` - Misiones

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd api-superheroes
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `env.example`:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Configuración de la base de datos MongoDB
MONGO_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/tu_base_de_datos?retryWrites=true&w=majority

# Configuración del servidor
PORT=3001
NODE_ENV=development

# JWT Secret para autenticación (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_cambiar_en_produccion

# URL externa para Render (se configura automáticamente en Render)
RENDER_EXTERNAL_URL=https://tu-app.onrender.com

# Configuración de CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://tu-app.onrender.com

# Configuración de notificaciones push (opcional)
VAPID_PUBLIC_KEY=tu_vapid_public_key
VAPID_PRIVATE_KEY=tu_vapid_private_key
```

### 4. Ejecutar el servidor

#### Desarrollo
```bash
npm run dev
```

#### Producción
```bash
npm start
```

### 5. Ejecutar tests
```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### 6. Ejecutar seed de datos
```bash
npm run seed
```

## 📖 Documentación

Una vez que el servidor esté corriendo, puedes acceder a:

- **Documentación Swagger**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## 🏗️ Estructura del Proyecto

```
api-superheroes/
├── app.js                 # Servidor principal
├── package.json           # Dependencias y scripts
├── env.example           # Ejemplo de variables de entorno
├── middleware/           # Middleware personalizado
│   ├── errorHandler.js   # Manejo de errores
│   └── rateLimiter.js    # Rate limiting
├── tests/               # Tests unitarios
│   └── auth.test.js     # Tests de autenticación
└── src/
    ├── controllers/     # Controladores de rutas
    ├── models/         # Modelos de datos
    ├── routes/         # Definición de rutas
    ├── services/       # Lógica de negocio
    ├── middleware/     # Middleware de autenticación
    ├── utils/          # Utilidades y errores
    └── socket/         # Configuración de Socket.IO
```

## 🔒 Seguridad

### Rate Limiting
- **General**: 100 requests por 15 minutos
- **Autenticación**: 5 intentos por 15 minutos
- **Creación de recursos**: 10 creaciones por minuto
- **Cuidado de mascotas**: 30 acciones por minuto

### Validación
- Validación de entrada con express-validator
- Validación de ObjectId de MongoDB
- Sanitización de datos

### Manejo de Errores
- Errores tipados y consistentes
- Logs detallados en desarrollo
- Respuestas de error estructuradas

## 🧪 Testing

### Tests Unitarios
```bash
npm test
```

### Tests con Coverage
```bash
npm run test:coverage
```

### Tests Automatizados
```bash
node run_tests.js
```

## 🚀 Despliegue

### Render.com
El proyecto incluye configuración para Render.com con:
- `render.yaml` - Configuración de despliegue
- `Procfile` - Comando de inicio
- Variables de entorno automáticas

### Variables de Entorno Requeridas
- `MONGO_URI` - URL de conexión a MongoDB
- `JWT_SECRET` - Clave secreta para JWT
- `NODE_ENV` - Entorno (development/production)

## 🎯 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Socket.IO** - Comunicación en tiempo real
- **Swagger** - Documentación de API
- **Jest** - Testing
- **Cron** - Tareas programadas
- **Rate Limiting** - Protección contra abuso

## 📝 Ejemplos de Uso

### Crear un Héroe
```bash
curl -X POST http://localhost:3001/api/heroes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "name": "Roberto Gómez Bolaños",
    "alias": "Chapulin Colorado",
    "city": "CDMX",
    "team": "Independiente"
  }'
```

### Alimentar una Mascota
```bash
curl -X POST http://localhost:3001/api/pet-care/<pet-id>/feed \
  -H "Authorization: Bearer <tu-token>"
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

**javerage** - [GitHub](https://github.com/javerage)

---

¡Disfruta usando la API de Superhéroes y Mascotas! 🦸‍♂️🐕 