# 🏠 Deployment con Cloudflare Tunnel - AJDREW

## Tu Setup

- **Dominio**: `ajdrew.andrewlamaquina.my`
- **Servidor**: Casero con múltiples proyectos
- **Túnel**: Cloudflare Tunnel (cloudflared)
- **Puertos configurados**:
  - Nginx: `8081` (host) → `80` (container)
  - Frontend: `3002` (host) → `3001` (container)
  - PostgreSQL: `5433` (host) → `5432` (container) *(opcional para acceso externo)*

---

## ✅ Recomendación: DB Local

**SÍ, te recomiendo desplegar la DB en tu servidor** por las siguientes razones:

### Ventajas:
1. ✅ **Performance**: Latencia casi cero entre backend y DB
2. ✅ **Privacidad**: Tus datos quedan en tu servidor
3. ✅ **Costo**: $0 (vs servicios cloud que cobran)
4. ✅ **Control total**: Backups cuando quieras
5. ✅ **Simplicidad**: Todo en un solo `docker-compose up`

### Consideraciones:
- ⚠️ **Backups**: Debes configurar backups regulares (ver abajo)
- ⚠️ **Espacio**: Asegúrate de tener suficiente disco
- ⚠️ **Persistencia**: Usa volumen Docker (ya configurado)

---

## 📋 Configuración de Cloudflare Tunnel

### 1. Crear/Editar Tunnel Config

Archivo: `~/.cloudflared/config.yml` (o donde tengas tu config)

```yaml
tunnel: <TU_TUNNEL_ID>
credentials-file: /path/to/credentials.json

ingress:
  # Otros proyectos que ya tengas...
  
  # AJDREW - Nuevo
  - hostname: ajdrew.andrewlamaquina.my
    service: http://localhost:8081
    originRequest:
      noTLSVerify: true
  
  # Catch-all (debe estar al final)
  - service: http_status:404
```

### 2. Reiniciar Cloudflared

```bash
sudo systemctl restart cloudflared
# O si lo corres manual:
# cloudflared tunnel run <TUNNEL_NAME>
```

### 3. Verificar tunnel

```bash
cloudflared tunnel info <TUNNEL_NAME>
```

---

## 🚀 Deployment Steps

### Paso 1: Preparar .env en el Servidor

```bash
# En tu servidor
cd /ruta/donde/quieras/ajdrew
# Ejemplo: cd /home/usuario/apps/ajdrew

# Clonar el repo (o pull si ya existe)
git clone https://github.com/TU_USUARIO/ajdrew-app.git .
# o: git pull origin main

# Copiar y editar .env
cp .env.production .env
nano .env
```

**Editar valores en `.env`**:

```bash
# Generar passwords seguros
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Actualizar en .env:
DB_USER=ajdrew_prod_user
DB_PASSWORD=<PASSWORD_GENERADO>
DB_NAME=ajdrew_production
DATABASE_URL=postgresql://ajdrew_prod_user:<PASSWORD_GENERADO>@db:5432/ajdrew_production

JWT_SECRET=<SECRET_GENERADO>
JWT_EXPIRATION=7d

# URLs ya están pre-configuradas
NEXT_PUBLIC_API_URL=https://ajdrew.andrewlamaquina.my/api
FRONTEND_URL=https://ajdrew.andrewlamaquina.my
ALLOWED_ORIGINS=https://ajdrew.andrewlamaquina.my
```

### Paso 2: Verificar Puertos Libres

```bash
# Verificar que los puertos no estén en uso
sudo lsof -i :8081  # Nginx
sudo lsof -i :3002  # Frontend
sudo lsof -i :5433  # PostgreSQL (opcional)

# Si alguno está en uso, editar docker-compose.prod.yml
# y cambiar el puerto del lado izquierdo
```

### Paso 3: Build

```bash
docker-compose -f docker-compose.prod.yml build

# Esto tomará 10-15 minutos la primera vez
```

### Paso 4: Iniciar Servicios

```bash
# Iniciar en background
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Paso 5: Ejecutar Migraciones

```bash
# Esperar a que DB esté lista (30 segundos aprox)
sleep 30

# Ejecutar migraciones
docker exec -it ajdrew-backend sh -c "cd /app/app/backend && npx prisma migrate deploy"

# Si tienes seed data
docker exec -it ajdrew-backend sh -c "cd /app/app/backend && npx prisma db seed"
```

### Paso 6: Verificar

```bash
# Verificar contenedores
docker ps | grep ajdrew

# Test local
curl http://localhost:8081/api/health
# Debe responder: {"status":"ok"}

# Test desde el dominio (esperar 1-2 mins para DNS)
curl https://ajdrew.andrewlamaquina.my/api/health
```

---

## 🔧 Configuración de Backups Automáticos

### Script de Backup

Crear `/home/usuario/scripts/backup-ajdrew-db.sh`:

```bash
#!/bin/bash
# Backup de DB de AJDREW

BACKUP_DIR="/home/usuario/backups/ajdrew"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ajdrew_production"
DB_USER="ajdrew_prod_user"

mkdir -p $BACKUP_DIR

# Backup
docker exec ajdrew-db pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/ajdrew_backup_$DATE.sql.gz

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "ajdrew_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completado: ajdrew_backup_$DATE.sql.gz"
```

Dar permisos:
```bash
chmod +x /home/usuario/scripts/backup-ajdrew-db.sh
```

### Cron para Backups Diarios

```bash
# Editar crontab
crontab -e

# Agregar (backup diario a las 3am)
0 3 * * * /home/usuario/scripts/backup-ajdrew-db.sh >> /home/usuario/logs/backup-ajdrew.log 2>&1
```

---

## 📊 Monitoreo

### Ver logs en tiempo real:
```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Solo backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Solo frontend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Ver uso de recursos:
```bash
docker stats
```

### Verificar salud:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## 🔄 Actualizar la Aplicación

```bash
# 1. Hacer pull de cambios
git pull origin main

# 2. Rebuild (solo servicios que cambiaron)
docker-compose -f docker-compose.prod.yml build backend frontend

# 3. Recrear contenedores
docker-compose -f docker-compose.prod.yml up -d

# 4. Ver logs para verificar
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🆘 Troubleshooting

### Problema: Puerto 8081 ya en uso

```bash
# Verificar qué lo está usando
sudo lsof -i :8081

# Opción 1: Cambiar puerto en docker-compose.prod.yml
# Ejemplo: "8082:80"

# Opción 2: Detener el otro servicio
sudo systemctl stop <servicio>
```

### Problema: No se ve el sitio en el dominio

```bash
# 1. Verificar tunnel
cloudflared tunnel info

# 2. Verificar nginx local
curl http://localhost:8081

# 3. Ver logs de cloudflared
sudo journalctl -u cloudflared -f

# 4. Verificar DNS en Cloudflare Dashboard
```

### Problema: ShareButton usa localhost

```bash
# Verificar variable de entorno
docker exec ajdrew-frontend env | grep NEXT_PUBLIC_API_URL

# Debe mostrar: NEXT_PUBLIC_API_URL=https://ajdrew.andrewlamaquina.my/api

# Si no, rebuild sin cache:
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Checklist Pre-Deploy

- [ ] `.env` creado con valores de producción
- [ ] Passwords generados (DB_PASSWORD, JWT_SECRET)
- [ ] Puertos verificados (8081, 3002, 5433 libres)
- [ ] Cloudflare Tunnel configurado para `ajdrew.andrewlamaquina.my`
- [ ] DNS apuntando correctamente
- [ ] Espacio en disco suficiente (mín 10GB)

---

## 📝 Checklist Post-Deploy

- [ ] Contenedores corriendo (`docker ps`)
- [ ] Backend health OK (`curl http://localhost:8080/api/health`)
- [ ] Sitio accesible en `https://ajdrew.andrewlamaquina.my`
- [ ] ShareButtons funcionan y usan dominio correcto
- [ ] OG Images se generan correctamente
- [ ] Migraciones ejecutadas
- [ ] Backups automáticos configurados
- [ ] Logs monitoreados

---

## 🎯 Comandos Rápidos

```bash
# Ver estado
docker ps

# Logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar
docker-compose -f docker-compose.prod.yml restart

# Detener
docker-compose -f docker-compose.prod.yml down

# Rebuild completo
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Backup manual
docker exec ajdrew-db pg_dump -U ajdrew_prod_user ajdrew_production | gzip > backup_manual.sql.gz
```

---

**¿Listo?** → `docker-compose -f docker-compose.prod.yml up -d` 🚀
