# Despliegue en Render - API Héroes

## Pasos para desplegar en Render

### 1. Preparación del repositorio
- Asegúrate de que tu código esté en un repositorio de GitHub
- Verifica que todos los archivos estén committeados

### 2. Configuración en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `api-heroes`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Variables de Entorno

Configura las siguientes variables de entorno en Render:

```
MONGO_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/tu_base_de_datos?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
NODE_ENV=production
PORT=3001
```

### 4. Base de datos MongoDB

1. Crea una cuenta en [MongoDB Atlas](https://mongodb.com/atlas)
2. Crea un cluster gratuito
3. Crea un usuario de base de datos
4. Obtén la URI de conexión
5. Configura la variable `MONGO_URI` en Render

### 5. Despliegue

1. Haz clic en "Create Web Service"
2. Render comenzará a construir y desplegar tu aplicación
3. Una vez completado, obtendrás una URL como: `https://api-heroes.onrender.com`

### 6. Verificación

- Visita la URL de tu API
- Verifica que la documentación Swagger esté disponible en: `https://tu-app.onrender.com/api-docs`
- Prueba algunos endpoints básicos

### 7. Configuración del Frontend

Una vez desplegada la API, actualiza la URL en tu aplicación frontend (`mascota-visual`):

```javascript
// En src/api.js
const API_BASE_URL = 'https://tu-app.onrender.com/api';
```

## Notas importantes

- El plan gratuito de Render puede tener el servicio inactivo después de 15 minutos de inactividad
- La primera petición después del período de inactividad puede tardar unos segundos
- Considera actualizar a un plan de pago para mejor rendimiento en producción 