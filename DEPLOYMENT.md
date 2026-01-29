# 🚀 Guía de Deployment - AJDREW Production

## Pre-requisitos

- ✅ Servidor con Docker y Docker Compose instalados
- ✅ Dominio configurado apuntando al servidor
- ✅ Puerto 80 (HTTP) y 443 (HTTPS) abiertos en el firewall
- ✅ Acceso SSH al servidor

---

## Paso 1: Preparar Variables de Entorno

### En tu servidor, crea el archivo `.env`:

```bash
# Crear directorio del proyecto
mkdir -p /opt/ajdrew
cd /opt/ajdrew

# Crear archivo .env
nano .env
```

### Copia y completa con tus valores:

```bash
# =====================================
# 🗄️ DATABASE
# =====================================
DB_USER=ajdrew_prod_user
DB_PASSWORD=TU_PASSWORD_SUPER_SEGURO_AQUI_32_CARACTERES
DB_NAME=ajdrew_production
DATABASE_URL=postgresql://ajdrew_prod_user:TU_PASSWORD_SUPER_SEGURO_AQUI_32_CARACTERES@db:5432/ajdrew_production

# =====================================
# 🔐 JWT
# =====================================
JWT_SECRET=TU_SECRET_JWT_GENERADO_CON_OPENSSL
JWT_EXPIRATION=7d

# =====================================
# ☁️ CLOUDINARY
# =====================================
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# =====================================
# 🌐 URLS (CRÍTICO - Reemplaza con tu dominio)
# =====================================
NEXT_PUBLIC_API_URL=https://tudominio.com/api
FRONTEND_URL=https://tudominio.com
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com

# =====================================
# ⚙️ OTROS
# =====================================
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=3001
```

### Generar secretos seguros:

```bash
# Generar DB_PASSWORD (32 caracteres)
openssl rand -base64 32

# Generar JWT_SECRET (256 bits)
openssl rand -base64 32
```

### Asegurar permisos:

```bash
chmod 600 .env
```

---

## Paso 2: Subir Código al Servidor

### Opción A: Usar Git (Recomendado)

```bash
# En el servidor
cd /opt/ajdrew
git clone https://github.com/TU_USUARIO/ajdrew-app.git .

# ⚠️ NO COMMITEES .env a git
# Verificar que .env.production NO esté commiteado
```

### Opción B: Transferir con SCP

```bash
# Desde tu máquina local
scp -r /ruta/al/proyecto/* usuario@servidor:/opt/ajdrew/
```

---

## Paso 3: Construir Imágenes Docker

```bash
cd /opt/ajdrew

# Build de todas las imágenes
docker-compose -f docker-compose.prod.yml build

# Esto tomará varios minutos (10-15min aprox)
```

---

## Paso 4: Iniciar Servicios

```bash
# Iniciar todos los servicios en background
docker-compose -f docker-compose.prod.yml up -d

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Ver solo logs del backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Ver solo logs del frontend  
docker-compose -f docker-compose.prod.yml logs -f frontend
```

---

## Paso 5: Verificar Servicios

```bash
# Ver estado de contenedores
docker ps

# Deberías ver:
# ✅ ajdrew-nginx (puerto 80)
# ✅ ajdrew-frontend (puerto 3001)
# ✅ ajdrew-backend (puerto 3000)
# ✅ ajdrew-db (puerto 5432)
# ✅ prisma-studio (puerto 5555)
```

### Verificar salud de servicios:

```bash
# Health check del backend
curl http://localhost/api/health

# Health check del frontend
curl http://localhost/

# Deberían responder 200 OK
```

---

## Paso 6: Ejecutar Migraciones de Base de Datos

```bash
# Entrar al contenedor del backend
docker exec -it ajdrew-backend sh

# Ejecutar migraciones de Prisma
cd /app/app/backend
npx prisma migrate deploy

# Salir del contenedor
exit
```

---

## Paso 7: (Opcional) Seed de Datos Iniciales

```bash
# Si tienes datos de seed
docker exec -it ajdrew-backend sh
cd /app/app/backend
npx prisma db seed
exit
```

---

## Paso 8: Configurar SSL/HTTPS con Certbot

### Instalar Certbot:

```bash
# En el servidor (fuera de Docker)
sudo apt-get update
sudo apt-get install certbot
```

### Obtener certificado:

```bash
# Detener nginx temporalmente
docker-compose -f docker-compose.prod.yml stop nginx

# Obtener certificado
sudo certbot certonly --standalone -d tudominio.com -d www.tudominio.com

# Reiniciar nginx
docker-compose -f docker-compose.prod.yml start nginx
```

### Actualizar `nginx.conf` para HTTPS:

Editar `app/nginx/nginx.conf` y agregar:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    # ... resto de la configuración
}
```

### Montar certificados en Docker:

Editar `docker-compose.prod.yml`:

```yaml
nginx:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
  ports:
    - "80:80"
    - "443:443"
```

### Reconstruir y reiniciar:

```bash
docker-compose -f docker-compose.prod.yml up -d --build nginx
```

---

## Paso 9: Verificar en Navegador

1. **Acceder a tu dominio**: `https://tudominio.com`
2. **Verificar ShareButtons**:
   - Ir a `/tutoriales/[cualquier-tutorial]`
   - El ShareButton debería usar la URL completa del dominio
3. **Verificar OG Images**:
   - Compartir en WhatsApp/Facebook
   - Verificar que se muestre la imagen correcta

---

## Comandos Útiles

### Ver logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f [servicio]
```

### Reiniciar un servicio:
```bash
docker-compose -f docker-compose.prod.yml restart [servicio]
```

### Detener todos los servicios:
```bash
docker-compose -f docker-compose.prod.yml down
```

### Rebuild completo:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Ver uso de recursos:
```bash
docker stats
```

### Backup de base de datos:
```bash
docker exec ajdrew-db pg_dump -U ajdrew_prod_user ajdrew_production > backup_$(date +%Y%m%d).sql
```

### Restaurar base de datos:
```bash
cat backup_20260128.sql | docker exec -i ajdrew-db psql -U ajdrew_prod_user -d ajdrew_production
```

---

## Troubleshooting

### ❌ Error: "Cannot find module"
```bash
# Rebuild sin caché
docker-compose -f docker-compose.prod.yml build --no-cache
```

### ❌ Error: "Database connection failed"
```bash
# Verificar que la DB esté corriendo
docker ps | grep ajdrew-db

# Ver logs de la DB
docker-compose -f docker-compose.prod.yml logs db
```

### ❌ Error: "502 Bad Gateway"
```bash
# Verificar que backend esté corriendo
docker-compose -f docker-compose.prod.yml logs backend

# Verificar health
curl http://localhost:3000/health
```

### ❌ ShareButton no funciona / Usa localhost
```bash
# Verificar que NEXT_PUBLIC_API_URL esté configurado correctamente
docker exec ajdrew-frontend env | grep NEXT_PUBLIC

# Si muestra /api o localhost, rebuild:
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d frontend
```

---

## Mantenimiento

### Actualizar código:

```bash
# Pull cambios
git pull origin main

# Rebuild
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Renovar certificado SSL:

```bash
sudo certbot renew
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## ✅ Checklist Post-Deploy

- [ ] Todos los contenedores están running
- [ ] Backend responde en `/api/health`
- [ ] Frontend se carga correctamente
- [ ] ShareButtons usan URL completa (no localhost)
- [ ] OG Images se generan correctamente
- [ ] SSL/HTTPS configurado
- [ ] Migraciones ejecutadas
- [ ] Backup de DB configurado
- [ ] Logs siendo monitoreados

🎉 **¡Deployment Exitoso!**
