#!/bin/bash
# Script para verificar puertos disponibles para AJDREW

echo "========================================="
echo "🔍 VERIFICACIÓN DE PUERTOS - AJDREW"
echo "========================================="
echo ""

# Puertos propuestos para AJDREW
PROPOSED_NGINX=8080
PROPOSED_FRONTEND=3002
PROPOSED_DB=5433
PROPOSED_PRISMA=5556

echo "📋 Puertos propuestos para AJDREW:"
echo "  - Nginx:        $PROPOSED_NGINX"
echo "  - Frontend:     $PROPOSED_FRONTEND"
echo "  - PostgreSQL:   $PROPOSED_DB"
echo "  - Prisma Studio: $PROPOSED_PRISMA (opcional)"
echo ""
echo "========================================="
echo ""

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    local name=$2
    
    echo -n "Puerto $port ($name): "
    
    if sudo lsof -i :$port > /dev/null 2>&1; then
        echo "❌ EN USO"
        echo "   Proceso usando el puerto:"
        sudo lsof -i :$port | tail -n +2 | awk '{printf "   → %s (PID: %s)\n", $1, $2}'
        return 1
    else
        echo "✅ LIBRE"
        return 0
    fi
}

echo "🔍 Verificando puertos propuestos..."
echo ""

check_port $PROPOSED_NGINX "Nginx"
nginx_free=$?

check_port $PROPOSED_FRONTEND "Frontend" 
frontend_free=$?

check_port $PROPOSED_DB "PostgreSQL"
db_free=$?

check_port $PROPOSED_PRISMA "Prisma Studio"
prisma_free=$?

echo ""
echo "========================================="
echo "📊 RESUMEN"
echo "========================================="

if [ $nginx_free -eq 0 ] && [ $frontend_free -eq 0 ] && [ $db_free -eq 0 ]; then
    echo "✅ Todos los puertos críticos están LIBRES"
    echo ""
    echo "Puedes usar la configuración propuesta:"
    echo "  - Nginx:      $PROPOSED_NGINX"
    echo "  - Frontend:   $PROPOSED_FRONTEND"
    echo "  - PostgreSQL: $PROPOSED_DB"
else
    echo "⚠️  Algunos puertos están ocupados. Necesitas elegir alternativas."
    echo ""
    echo "🔍 Buscando puertos alternativos libres..."
    echo ""
    
    # Buscar alternativas
    if [ $nginx_free -ne 0 ]; then
        for port in 8081 8082 8083 8084 8085; do
            if ! sudo lsof -i :$port > /dev/null 2>&1; then
                echo "  Nginx alternativo: $port ✅"
                break
            fi
        done
    fi
    
    if [ $frontend_free -ne 0 ]; then
        for port in 3003 3004 3005 3006; do
            if ! sudo lsof -i :$port > /dev/null 2>&1; then
                echo "  Frontend alternativo: $port ✅"
                break
            fi
        done
    fi
    
    if [ $db_free -ne 0 ]; then
        for port in 5434 5435 5436 5437; do
            if ! sudo lsof -i :$port > /dev/null 2>&1; then
                echo "  PostgreSQL alternativo: $port ✅"
                break
            fi
        done
    fi
fi

echo ""
echo "========================================="
echo "🌐 PROYECTOS ACTUALES EN EL SERVIDOR"
echo "========================================="
echo ""
echo "Contenedores Docker en ejecución:"
docker ps --format "table {{.Names}}\t{{.Ports}}" 2>/dev/null || echo "No se pudo obtener lista de contenedores"

echo ""
echo "========================================="
echo "💡 SIGUIENTE PASO"
echo "========================================="
echo ""
echo "Si todos los puertos están libres, puedes proceder con:"
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "Si hay conflictos, edita docker-compose.prod.yml con los puertos alternativos."
echo ""
