#!/bin/bash

# Script de Despliegue con Compilación en Host (Anti-bloqueo DNS en Docker)
set -e

echo "🚀 Iniciando despliegue..."

# 1. Obtener los últimos cambios de Git
echo "📥 Descargando últimos cambios de Git..."
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📌 Versión actual (Git Commit): $CURRENT_COMMIT"

# 2. Instalar dependencias y compilar en el Host (que sí tiene DNS y red libre)
echo "📦 Instalando dependencias en el host..."
pnpm install --no-frozen-lockfile || pnpm install

echo "🔨 Compilando backend en el host..."
pnpm --filter backend build
rm -rf ./app/backend/out
pnpm --filter backend deploy --prod --legacy ./app/backend/out

echo "🔨 Compilando frontend (Next.js) en el host..."
pnpm --filter frontend build

# 3. Detener contenedores actuales
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# 4. Construir y levantar contenedores (Docker solo copia los archivos ya compilados)
echo "🐳 Levantando contenedores en Docker..."
docker compose -f docker-compose.prod.yml up -d --build

# 5. Limpieza
echo "🧹 Limpiando imágenes huérfanas..."
docker image prune -f

echo "✅ ¡Despliegue completado con éxito!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
