# Imagen base ligera
FROM node:20-alpine

# Crear usuario no root (opcional)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Instalar pnpm con corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar manifiestos del monorepo
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY app/backend/package.json ./app/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Instalar dependencias del workspace
RUN pnpm install

# Copiar código del backend (incluyendo prisma/)
COPY app/backend ./app/backend
COPY packages/shared ./packages/shared

# Cambiar a la carpeta del backend
WORKDIR /app/app/backend

# 🔧 Generar el cliente de Prisma dentro del contenedor
RUN pnpm exec prisma generate

# 🛠️ Solución para error "@prisma/engines not found"
# Forzamos instalación de los binarios de Prisma
RUN pnpm exec prisma generate --schema=./prisma/schema.prisma && \
    pnpm exec prisma --version

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["pnpm", "start"]
