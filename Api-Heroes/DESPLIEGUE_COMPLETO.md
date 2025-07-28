# 🚀 Guía Completa de Despliegue - API Héroes en Render

## 📋 Resumen del Proceso

Para que tu aplicación "mascota-visual" funcione correctamente, necesitas desplegar primero la API de héroes en Render. Aquí tienes la guía completa:

## 🎯 Pasos a seguir

### 1. Preparación del código
- ✅ Los archivos de configuración ya están creados
- ✅ El `package.json` está configurado correctamente
- ✅ Los scripts de inicio están listos

### 2. Configurar MongoDB Atlas
1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster gratuito (M0)
4. Configura un usuario de base de datos
5. Permite acceso desde cualquier IP (0.0.0.0/0)
6. Obtén la URI de conexión

### 3. Subir código a GitHub
1. Crea un repositorio en GitHub
2. Sube todo el código de la carpeta `Api-Heroes`
3. Asegúrate de que el archivo `.env` esté en `.gitignore`

### 4. Desplegar en Render
1. Ve a [render.com](https://render.com)
2. Crea una cuenta
3. Haz clic en "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura el servicio:
   - **Name**: `api-heroes`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 5. Configurar Variables de Entorno en Render
Agrega estas variables en la sección "Environment Variables":

```
MONGO_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/heroes_db?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
NODE_ENV=production
PORT=3001
```

### 6. Desplegar
1. Haz clic en "Create Web Service"
2. Espera a que termine el build (puede tardar unos minutos)
3. Tu API estará disponible en: `https://tu-app.onrender.com`

### 7. Verificar el despliegue
1. Visita la URL de tu API
2. Verifica la documentación en: `https://tu-app.onrender.com/api-docs`
3. Prueba algunos endpoints básicos

### 8. Configurar el Frontend
Una vez que la API esté funcionando, actualiza la URL en `mascota-visual/src/api.js`:

```javascript
const API_URL = 'https://tu-app.onrender.com/api';
```

## 🔧 Archivos creados para el despliegue

- ✅ `env.example` - Variables de entorno de ejemplo
- ✅ `render.yaml` - Configuración de Render
- ✅ `Procfile` - Comando de inicio para Render
- ✅ `deploy.sh` - Script de preparación
- ✅ `DEPLOYMENT.md` - Guía detallada
- ✅ `MONGODB_SETUP.md` - Configuración de MongoDB
- ✅ `DESPLIEGUE_COMPLETO.md` - Esta guía

## 🚨 Problemas comunes

### Error de conexión a MongoDB
- Verifica que la URI sea correcta
- Asegúrate de que el usuario tenga permisos
- Verifica que el acceso de red esté configurado

### Error de build en Render
- Verifica que `package.json` tenga el script `start`
- Asegúrate de que todas las dependencias estén en `dependencies`
- Revisa los logs de build en Render

### API no responde
- Verifica que el puerto esté configurado correctamente
- Revisa los logs de la aplicación en Render
- Asegúrate de que las variables de entorno estén configuradas

## 🎉 Una vez desplegado

Tu API estará disponible y tu aplicación "mascota-visual" podrá conectarse a ella. La URL será algo como:
`https://api-heroes-gh4i.onrender.com`

¡Y listo! Tu aplicación completa estará funcionando en la nube. 🌟 