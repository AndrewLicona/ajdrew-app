#!/bin/bash
set -e

echo "🚀 Iniciando despliegue 100% aislado en Docker..."
 
# Habilitar Docker BuildKit para caché avanzada y compilación paralela
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# 1. Ajustar permisos
sudo chown -R $USER:$USER . || true

# 2. Git fetch & reset
echo "📥 Descargando últimos cambios de Git..."
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📌 Versión actual (Git Commit): $CURRENT_COMMIT"

# 3. Compilar y levantar contenedores en Docker (Build multi-etapa aislado)
echo "🐳 Compilando y levantando contenedores con Docker Compose..."
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

# 4. Limpieza de imágenes antiguas
docker image prune -f

echo "✅ ¡Despliegue completado con éxito 100% en Docker!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"


