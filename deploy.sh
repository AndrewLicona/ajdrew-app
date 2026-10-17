#!/bin/bash
set -e

echo "🚀 Iniciando despliegue con compilación en el host..."

# 1. Git pull
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📌 Versión actual (Git Commit): $CURRENT_COMMIT"

# 2. Instalar pnpm en el host si no existe
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm en el host..."
    npm install -g pnpm@10.18.0
fi

# 3. Instalar dependencias y compilar en el host
echo "📦 Instalando dependencias..."
pnpm install --no-frozen-lockfile || pnpm install

echo "🔨 Compilando backend..."
pnpm --filter backend build
rm -rf ./docker-backend-output
pnpm --filter backend deploy --prod --legacy ./docker-backend-output
cp app/backend/create-admin.ts ./docker-backend-output/create-admin.ts || true

echo "🔨 Compilando frontend..."
pnpm --filter frontend build
rm -rf ./docker-frontend-output
mkdir -p ./docker-frontend-output
cp -r app/frontend/.next/standalone/* ./docker-frontend-output/
mkdir -p ./docker-frontend-output/app/frontend/.next
cp -r app/frontend/.next/static ./docker-frontend-output/app/frontend/.next/static || true
cp -r app/frontend/.next/static ./docker-frontend-output/.next/static || true
cp -r app/frontend/public ./docker-frontend-output/app/frontend/public || true
cp -r app/frontend/public ./docker-frontend-output/public || true

# 4. Docker compose down
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# 5. Docker compose up (construye usando los directorios locales)
echo "🐳 Levantando contenedores..."
docker compose -f docker-compose.prod.yml up -d --build

# 6. Limpieza
docker image prune -f

echo "✅ ¡Despliegue completado con éxito!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
