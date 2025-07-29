# Configuración de MongoDB Atlas

## Pasos para configurar MongoDB Atlas

### 1. Crear cuenta en MongoDB Atlas
1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Completa el proceso de registro

### 2. Crear un cluster
1. Haz clic en "Build a Database"
2. Selecciona "FREE" plan (M0)
3. Selecciona tu proveedor de nube preferido (AWS, Google Cloud, Azure)
4. Selecciona la región más cercana a ti
5. Haz clic en "Create"

### 3. Configurar acceso a la base de datos
1. En "Security" → "Database Access"
2. Haz clic en "Add New Database User"
3. Crea un usuario con:
   - Username: `api-heroes-user`
   - Password: `tu_password_seguro`
   - Role: "Read and write to any database"
4. Haz clic en "Add User"

### 4. Configurar acceso de red
1. En "Security" → "Network Access"
2. Haz clic en "Add IP Address"
3. Para desarrollo: haz clic en "Allow Access from Anywhere" (0.0.0.0/0)
4. Para producción: agrega la IP de Render cuando la tengas

### 5. Obtener la URI de conexión
1. Ve a "Database" → "Connect"
2. Selecciona "Connect your application"
3. Copia la URI que aparece
4. Reemplaza `<password>` con la contraseña que creaste
5. Reemplaza `<dbname>` con el nombre de tu base de datos (ej: `heroes_db`)

### 6. Ejemplo de URI final
```
mongodb+srv://api-heroes-user:tu_password_seguro@cluster0.xxxxx.mongodb.net/heroes_db?retryWrites=true&w=majority
```

### 7. Configurar en Render
1. Ve a tu servicio en Render
2. En "Environment" → "Environment Variables"
3. Agrega la variable `MONGO_URI` con la URI que obtuviste

## Notas importantes
- Mantén segura tu contraseña de MongoDB
- No subas la URI a GitHub (está en .gitignore)
- Para producción, considera usar variables de entorno
- El cluster gratuito tiene limitaciones pero es suficiente para desarrollo 