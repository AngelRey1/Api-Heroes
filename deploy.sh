#!/bin/bash

echo "🚀 Preparando despliegue de API Héroes en Render..."

# Verificar que estamos en el directorio correcto
if [ ! -f "app.js" ]; then
    echo "❌ Error: No se encontró app.js. Asegúrate de estar en el directorio Api-Heroes"
    exit 1
fi

# Verificar que package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    exit 1
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que el archivo .env existe o crear uno de ejemplo
if [ ! -f ".env" ]; then
    echo "⚠️  No se encontró archivo .env"
    echo "📝 Creando archivo .env de ejemplo..."
    cp env.example .env
    echo "✅ Archivo .env creado. Por favor, configura las variables de entorno:"
    echo "   - MONGO_URI: Tu URI de MongoDB Atlas"
    echo "   - JWT_SECRET: Tu secreto JWT"
    echo "   - NODE_ENV: production"
    echo "   - PORT: 3001"
fi

echo "✅ Preparación completada!"
echo ""
echo "📋 Pasos para desplegar en Render:"
echo "1. Sube tu código a GitHub"
echo "2. Ve a render.com y crea una cuenta"
echo "3. Crea un nuevo Web Service"
echo "4. Conecta tu repositorio de GitHub"
echo "5. Configura las variables de entorno en Render:"
echo "   - MONGO_URI"
echo "   - JWT_SECRET"
echo "   - NODE_ENV=production"
echo "   - PORT=3001"
echo "6. Haz clic en 'Create Web Service'"
echo ""
echo "🔗 Una vez desplegado, actualiza la URL en mascota-visual/src/api.js" 