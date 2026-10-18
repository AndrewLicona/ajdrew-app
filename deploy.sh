#!/bin/bash
set -e

echo "🚀 Iniciando despliegue con compilación en el host..."

# 1. Ajustar permisos
sudo chown -R $USER:$USER . || true

# 2. Git fetch & reset
echo "📥 Descargando últimos cambios de Git..."
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📌 Versión actual (Git Commit): $CURRENT_COMMIT"

# 3. Compilar en el host (que sí tiene red y DNS 100% estables)
echo "📦 Instalando dependencias..."
pnpm install --no-frozen-lockfile || pnpm install

echo "🔨 Compilando backend..."
pnpm --filter backend build
rm -rf ./app/backend/out
pnpm --filter backend deploy --prod --legacy ./app/backend/out
cp app/backend/create-admin.ts ./app/backend/out/create-admin.js || true

echo "🔨 Compilando frontend..."
pnpm --filter frontend build

# 4. Detener contenedores previos
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# 5. Levantar Docker (Docker solo copia los archivos compilados, cero red necesaria)
echo "🐳 Levantando contenedores con Docker..."
docker compose -f docker-compose.prod.yml up -d --build

# 6. Limpieza
docker image prune -f

echo "✅ ¡Despliegue completado con éxito en tu Ubuntu Server!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
