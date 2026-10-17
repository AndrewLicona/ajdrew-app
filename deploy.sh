#!/bin/bash
set -e

echo "🚀 Iniciando despliegue en Docker..."

# 1. Ajustar permisos por si carpetas previas fueron creadas por root
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

# 4. Construir imágenes en Docker (ahora con UFW forwarding activo)
echo "🐳 Construyendo imágenes en Docker..."
docker compose -f docker-compose.prod.yml build --no-cache --pull

echo "🚢 Levantando contenedores..."
docker compose -f docker-compose.prod.yml up -d

# 5. Limpieza
echo "🧹 Limpiando imágenes huérfanas..."
docker image prune -f --filter "label=stage!=build"

echo "✅ ¡Despliegue completado con éxito!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
