# Solución para Error 400 al Crear Héroes en Render

## Problema Identificado

El error `POST https://api-heroes-gh4i.onrender.com/api/heroes 400 (Bad Request)` ocurre cuando se intenta crear un héroe desde el frontend desplegado en Render.

## Causas Posibles

1. **Validación de datos incompleta**: Los datos enviados desde el frontend no cumplen con las validaciones del backend
2. **Problemas de CORS**: Configuración incorrecta de orígenes permitidos
3. **Variables de entorno**: Configuración incorrecta en Render
4. **Autenticación**: Token JWT inválido o expirado

## Soluciones Implementadas

### 1. Mejoras en Validaciones (Backend)

**Archivo**: `src/routes/heroRoutes.js`
- Validaciones más específicas para cada campo
- Límites de longitud para campos de texto
- Validación de formato para códigos de color hexadecimal
- Mejor manejo de errores de validación

**Archivo**: `src/controllers/heroController.js`
- Logging detallado para debugging
- Manejo específico de errores de MongoDB
- Validación adicional en el controlador
- Limpieza de datos antes de procesar

### 2. Mejoras en Configuración de CORS

**Archivo**: `app.js`
- URLs específicas para Render agregadas a la lista de orígenes permitidos
- Configuración más robusta de headers y métodos permitidos

### 3. Mejoras en el Frontend

**Archivo**: `src/pages/Customization.js`
- Validación adicional antes de enviar datos
- Mejor manejo de errores con mensajes específicos
- Logging para debugging
- Limpieza de datos antes de enviar

## Pasos para Verificar y Solucionar

### 1. Verificar Variables de Entorno en Render

```bash
# Ejecutar el script de verificación
node check-env.js
```

Asegúrate de que las siguientes variables estén configuradas en Render:
- `MONGO_URI`: URL de conexión a MongoDB
- `JWT_SECRET`: Clave secreta para JWT
- `NODE_ENV`: production
- `ALLOWED_ORIGINS`: URLs permitidas para CORS

### 2. Probar Conexión

```bash
# Ejecutar el script de prueba de conexión
node test-connection.js
```

### 3. Verificar Logs en Render

1. Ve al dashboard de Render
2. Selecciona tu servicio backend
3. Ve a la pestaña "Logs"
4. Busca errores relacionados con:
   - Validación de datos
   - Conexión a MongoDB
   - Errores de CORS

### 4. Verificar en el Navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Intenta crear un héroe
4. Revisa la petición POST a `/api/heroes`
5. Verifica:
   - Headers de la petición
   - Datos enviados en el body
   - Respuesta del servidor

## Debugging Adicional

### Verificar Token de Autenticación

```javascript
// En la consola del navegador
console.log('Token:', localStorage.getItem('token'));
```

### Verificar Datos Enviados

```javascript
// En el componente Customization.js
console.log('Datos del héroe:', heroData);
```

### Verificar Respuesta del Servidor

Los logs del backend ahora incluyen información detallada sobre:
- Datos recibidos
- Errores de validación
- Errores de MongoDB
- Errores de autenticación

## Configuración Recomendada para Render

### Variables de Entorno

```env
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/tu_base_de_datos
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
RENDER_EXTERNAL_URL=https://api-heroes-gh4i.onrender.com
ALLOWED_ORIGINS=https://api-heroes-frontend.onrender.com,https://mascota-visual.onrender.com
```

### Configuración de CORS

El backend ahora permite conexiones desde:
- `http://localhost:3000` (desarrollo local)
- `http://localhost:3001` (desarrollo local)
- `https://api-heroes-frontend.onrender.com` (frontend en Render)
- `https://mascota-visual.onrender.com` (frontend alternativo)
- `https://api-heroes-gh4i.onrender.com` (backend)

## Comandos Útiles

```bash
# Verificar configuración
node check-env.js

# Probar conexión
node test-connection.js

# Ver logs en tiempo real (si tienes acceso SSH)
tail -f logs/app.log
```

## Contacto

Si el problema persiste después de implementar estas soluciones, revisa:
1. Los logs del backend en Render
2. La consola del navegador para errores de JavaScript
3. La pestaña Network en las herramientas de desarrollador
4. La configuración de variables de entorno en Render 