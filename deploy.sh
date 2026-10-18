#!/bin/bash
set -e

echo "🚀 Iniciando despliegue con compilación 100% dentro de Docker (Aislado)..."

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

# 4. Construir y levantar todo dentro de Docker (con DNS dedicado y red aislada)
echo "🐳 Reconstruyendo y levantando contenedores con Docker..."
docker compose -f docker-compose.prod.yml up -d --build --force-recreate

# 5. Limpieza
docker image prune -f

echo "✅ ¡Despliegue completado con éxito en tu Ubuntu Server (100% Docker)!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
