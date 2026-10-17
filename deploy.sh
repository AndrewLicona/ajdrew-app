#!/bin/bash
set -e

echo "🚀 Iniciando despliegue con Docker (Ubuntu Server)..."

# 1. Ajustar permisos
sudo chown -R $USER:$USER . || true

# 2. Git fetch & reset
echo "📥 Descargando últimos cambios de Git..."
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📌 Versión actual (Git Commit): $CURRENT_COMMIT"

# 3. Detener contenedores previos
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# 4. Construir y levantar todo dentro de Docker
echo "🐳 Reconstruyendo imágenes dentro de Docker..."
docker compose -f docker-compose.prod.yml build --no-cache --pull

echo "🚢 Iniciando nuevos contenedores..."
docker compose -f docker-compose.prod.yml up -d

# 5. Limpieza
docker image prune -f --filter "label=stage!=build"

echo "✅ ¡Despliegue completado con éxito en Docker!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
