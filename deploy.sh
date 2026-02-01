#!/bin/bash

# Script de Despliegue Automático para AJDREW App

echo "🚀 Iniciando despliegue..."

# 1. Obtener los últimos cambios del repositorio
echo "📥 Descargando cambios de Git..."
git pull origin main

# 2. Detener y eliminar contenedores previos para evitar conflictos
echo "🛑 Deteniendo contenedores actuales..."
docker compose -f docker-compose.prod.yml down

# 3. Reconstruir y reiniciar los contenedores en segundo plano
echo "🐳 Reconstruyendo contenedores..."
docker compose -f docker-compose.prod.yml up -d --build

# 4. Limpiar solo imágenes huérfanas (dangling) para no borrar backups o imágenes base necesarias
echo "🧹 Limpiando imágenes temporales huérfanas..."
docker image prune -f --filter "label=stage!=build"

echo "✅ ¡Despliegue completado con éxito!"
echo "🌐 Frontend activo en el puerto 3300"
echo "⚙️ Backend activo en el puerto 3400"
