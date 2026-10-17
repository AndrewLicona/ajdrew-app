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

# 3. Asegurar que pnpm está instalado en el host
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm en el host..."
    npm install -g pnpm@10.18.0
fi

# 4. Instalar dependencias y compilar en el host (que sí tiene internet y DNS 100% funcionales)
echo "📦 Instalando dependencias en el host..."
pnpm install --no-frozen-lockfile || pnpm install

echo "🔨 Compilando backend en el host..."
pnpm --filter backend build
rm -rf ./docker-backend-output
pnpm --filter backend deploy --prod --legacy ./docker-backend-output
cp app/backend/create-admin.ts ./docker-backend-output/create-admin.ts || true

echo "🔨 Compilando frontend (Next.js) en el host..."
pnpm --filter frontend build
rm -rf ./docker-frontend-output
mkdir -p ./docker-frontend-output
cp -r app/frontend/.next/standalone/* ./docker-frontend-output/
mkdir -p ./docker-frontend-output/.next/static
cp -r app/frontend/.next/static ./docker-frontend-output/.next/static/ || true
cp -r app/frontend/public ./docker-frontend-output/public || true

# 5. Detener contenedores previos
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# 6. Levantar contenedores (Docker solo copia los archivos ya compilados)
echo "🐳 Levantando contenedores con Docker..."
docker compose -f docker-compose.prod.yml up -d --build

# 7. Limpieza
docker image prune -f

echo "✅ ¡Despliegue completado con éxito!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
