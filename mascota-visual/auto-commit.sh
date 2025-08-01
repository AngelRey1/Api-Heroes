#!/bin/bash

# Script de Auto-Commit para Frontend Mascota Visual
# Autor: Asistente IA
# Fecha: $(date)

echo "🎮 Iniciando Auto-Commit para Frontend Mascota Visual..."

# Función para hacer commit
commit_frontend() {
    local commit_message="$1"
    
    echo "📁 Procesando repositorio: Frontend Mascota-Visual"
    
    # Verificar si hay cambios
    if [[ -n $(git status --porcelain) ]]; then
        echo "✅ Agregando cambios..."
        git add .
        
        echo "💾 Haciendo commit..."
        git commit -m "$commit_message"
        
        echo "🚀 Haciendo push..."
        git push origin master
        
        echo "✅ Frontend actualizado exitosamente!"
    else
        echo "ℹ️ No hay cambios en el frontend"
    fi
    
    echo "---"
}

# Obtener fecha y hora actual
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Mensaje de commit para el frontend
FRONTEND_COMMIT="🎮 Componente VirtualPet - $TIMESTAMP

✨ Nuevas funcionalidades:
- Interfaz visual idéntica a la imagen proporcionada
- Stats en tiempo real con barras de progreso animadas
- Avatar con glow personalizable
- 9 botones de acción con efectos visuales
- Sistema de estados de ánimo y vida
- Mensajes toast y feedback visual
- Responsive design para móviles
- Integración completa con API del backend

🎨 Archivos modificados:
- VirtualPet.js: Componente principal de mascota virtual
- VirtualPet.css: Estilos completos con animaciones
- api.js: Funciones de API para todas las acciones
- auto-commit.sh: Script de automatización

🎯 Características implementadas:
- Avatar circular con efecto glow
- Barras de progreso con animaciones shimmer
- Botones de acción con gradientes y efectos hover
- Indicadores de estado de vida y ánimo
- Mensajes toast con animaciones slide-in
- Diseño responsive para móviles
- Integración con todas las APIs del backend"

# Ejecutar commit
commit_frontend "$FRONTEND_COMMIT"

echo "🎉 Auto-Commit del frontend completado exitosamente!"
echo "📊 Resumen:"
echo "   - Componente VirtualPet implementado"
echo "   - Interfaz visual completa"
echo "   - Estilos CSS con animaciones"
echo "   - Integración con API del backend"
echo ""
echo "🚀 El frontend está listo para despliegue en Render!" 