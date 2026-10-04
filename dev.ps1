# dev.ps1 — Levanta el entorno de desarrollo local
# Uso: .\dev.ps1
# Requisito: Docker Desktop corriendo (para DB y Redis)

Write-Host "🚀 Iniciando entorno de desarrollo..." -ForegroundColor Cyan

# 1. Levantar DB + Redis en Docker
Write-Host "`n📦 Levantando DB y Redis en Docker..." -ForegroundColor Yellow
docker compose -f docker-compose.dev.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error levantando Docker. ¿Está Docker Desktop corriendo?" -ForegroundColor Red
    exit 1
}

# 2. Esperar a que la DB esté lista
Write-Host "`n⏳ Esperando que PostgreSQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 3. Aplicar migraciones de Prisma
Write-Host "`n🗄️  Aplicando migraciones de Prisma..." -ForegroundColor Yellow
pnpm --filter backend exec prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Error en migraciones (puede ser que ya estén aplicadas)" -ForegroundColor DarkYellow
}

Write-Host "`n✅ Entorno listo!" -ForegroundColor Green
Write-Host "   DB:      localhost:5432" -ForegroundColor White
Write-Host "   Redis:   localhost:6379" -ForegroundColor White
Write-Host "`n📌 Ahora abre 2 terminales:" -ForegroundColor Cyan
Write-Host "   Terminal 1 (Backend):  cd app/backend && pnpm start:dev" -ForegroundColor White
Write-Host "   Terminal 2 (Frontend): cd app/frontend && pnpm dev" -ForegroundColor White
Write-Host "`n   Backend:  http://localhost:3000/api" -ForegroundColor DarkCyan
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor DarkCyan
