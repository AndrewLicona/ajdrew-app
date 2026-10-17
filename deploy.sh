#!/bin/bash

# Script de Despliegue Automático para AJDREW App
set -e

echo "🚀 Iniciando despliegue..."

# 1. Obtener los últimos cambios del repositorio
echo "📥 Descargando últimos cambios de Git..."
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📌 Versión actual (Git Commit): $CURRENT_COMMIT"

# 2. Detener y eliminar contenedores previos
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# 3. Forzar Reconstrucción Limpia
echo "🐳 Reconstruyendo imágenes desde cero (esto puede tardar unos minutos)..."
docker compose -f docker-compose.prod.yml build --no-cache --pull

echo "🚢 Iniciando nuevos contenedores..."
docker compose -f docker-compose.prod.yml up -d

# 4. Limpieza
echo "🧹 Limpiando imágenes temporales huérfanas..."
docker image prune -f --filter "label=stage!=build"

echo "✅ ¡Despliegue completado con éxito!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
