#!/bin/bash
set -e

echo "🚀 Iniciando despliegue en Ubuntu Server..."

# 1. Cargar NVM y Node.js si está instalado en el usuario andrew
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
elif [ -s "/usr/local/nvm/nvm.sh" ]; then
    . "/usr/local/nvm/nvm.sh"
fi

# Verificar Node y pnpm
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está disponible en el PATH." >&2
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm no encontrado. Instalándolo globalmente..."
    npm install -g pnpm@10.18.0
fi

echo "📌 Versión de Node: $(node -v)"
echo "📌 Versión de pnpm: $(pnpm -v)"

# 2. Ajustar permisos
sudo chown -R $USER:$USER . || true

# 3. Git fetch & reset
echo "📥 Descargando últimos cambios de Git..."
git fetch origin main
git reset --hard origin/main

CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📌 Versión actual (Git Commit): $CURRENT_COMMIT"

# 4. Instalar dependencias y compilar en el host
echo "📦 Instalando dependencias..."
pnpm install --no-frozen-lockfile

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
mkdir -p ./docker-frontend-output/.next/static
cp -r app/frontend/.next/static ./docker-frontend-output/.next/static/ || true
cp -r app/frontend/public ./docker-frontend-output/public || true

# 5. Detener contenedores previos
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# 6. Levantar contenedores
echo "🐳 Levantando contenedores con Docker..."
docker compose -f docker-compose.prod.yml up -d --build

# 7. Limpieza
docker image prune -f

echo "✅ ¡Despliegue completado con éxito en tu Ubuntu Server!"
echo "📍 Commit desplegado: $CURRENT_COMMIT"
