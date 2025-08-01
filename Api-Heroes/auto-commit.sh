#!/bin/bash

# Script para commits automáticos del backend (Api-Heroes)
# Uso: ./auto-commit.sh [mensaje_opcional]

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio del backend."
    exit 1
fi

# Obtener el mensaje de commit
if [ -z "$1" ]; then
    # Generar mensaje automático basado en los cambios
    CHANGES=$(git status --porcelain | head -5 | cut -c4- | tr '\n' ', ')
    if [ -z "$CHANGES" ]; then
        COMMIT_MESSAGE="🔄 Actualización automática - $(date '+%Y-%m-%d %H:%M:%S')"
    else
        COMMIT_MESSAGE="🔄 Actualización: $CHANGES - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
else
    COMMIT_MESSAGE="$1"
fi

print_status "Iniciando commit automático para el backend..."
print_status "Mensaje: $COMMIT_MESSAGE"

# Verificar si hay cambios
if [ -z "$(git status --porcelain)" ]; then
    print_warning "No hay cambios para commitear"
    exit 0
fi

# Agregar todos los cambios
print_status "Agregando cambios..."
git add .

# Hacer el commit
print_status "Realizando commit..."
if git commit -m "$COMMIT_MESSAGE"; then
    print_success "Commit realizado exitosamente"
else
    print_error "Error al realizar el commit"
    exit 1
fi

# Push al repositorio remoto
print_status "Haciendo push al repositorio remoto..."
if git push; then
    print_success "Push realizado exitosamente"
else
    print_error "Error al hacer push"
    exit 1
fi

print_success "✅ Commit automático completado para el backend!"
print_status "Repositorio: Api-Heroes (Backend)"
print_status "Timestamp: $(date)" 