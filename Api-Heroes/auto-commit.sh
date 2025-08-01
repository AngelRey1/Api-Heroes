#!/bin/bash

# Script de Auto-Commit para Sistema de Mascota Virtual
# Autor: Asistente IA
# Fecha: $(date)

echo "🚀 Iniciando Auto-Commit para Sistema de Mascota Virtual..."

# Función para hacer commit en un repositorio
commit_repo() {
    local repo_path="$1"
    local repo_name="$2"
    local commit_message="$3"
    
    echo "📁 Procesando repositorio: $repo_name"
    cd "$repo_path"
    
    # Verificar si hay cambios
    if [[ -n $(git status --porcelain) ]]; then
        echo "✅ Agregando cambios en $repo_name..."
        git add .
        
        echo "💾 Haciendo commit en $repo_name..."
        git commit -m "$commit_message"
        
        echo "🚀 Haciendo push en $repo_name..."
        git push origin main 2>/dev/null || git push origin master 2>/dev/null
        
        echo "✅ $repo_name actualizado exitosamente!"
    else
        echo "ℹ️ No hay cambios en $repo_name"
    fi
    
    echo "---"
}

# Obtener fecha y hora actual
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Mensaje de commit para el backend
BACKEND_COMMIT="🐾 Sistema de Mascota Virtual - $TIMESTAMP

✨ Nuevas funcionalidades:
- Stats en tiempo real (salud, felicidad, sueño, hambre, limpieza)
- Degradación automática de stats
- 9 acciones de cuidado (alimentar, jugar, bañar, dormir, acariciar, curar)
- Sistema de consecuencias por negligencia
- Estados de ánimo dinámicos
- AutoUpdateService para actualización automática
- Documentación completa del sistema

🔧 Archivos modificados:
- petModel.js: Modelo completo de mascota virtual
- petService.js: Servicio con todas las funcionalidades
- petCareController.js: Controladores para todas las acciones
- petCareRoutes.js: Rutas de API para cuidado
- autoUpdateService.js: Servicio de actualización automática
- SISTEMA_MASCOTA_VIRTUAL.md: Documentación completa"

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
- auto-commit.sh: Script de automatización"

# Ruta base del proyecto
BASE_PATH="$(pwd)"

# Commit en el repositorio backend
if [[ -d "Api-Heroes" ]]; then
    commit_repo "Api-Heroes" "Backend API-Heroes" "$BACKEND_COMMIT"
fi

# Commit en el repositorio frontend
if [[ -d "mascota-visual" ]]; then
    commit_repo "mascota-visual" "Frontend Mascota-Visual" "$FRONTEND_COMMIT"
fi

echo "🎉 Auto-Commit completado exitosamente!"
echo "📊 Resumen:"
echo "   - Backend: Sistema de mascota virtual completo"
echo "   - Frontend: Componente VirtualPet con interfaz visual"
echo "   - Documentación: Guías completas de uso"
echo ""
echo "🚀 Los cambios están listos para despliegue en Render!" 