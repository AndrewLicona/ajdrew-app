# base image ligera con node
FROM node:20-alpine

# crear usuario no-root opcional (mejora seguridad)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# instalar corepack/pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copiar solo los manifests necesarios para instalar dependencias del workspace
# esto permite aprovechar la cache de docker en builds incrementales
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY app/frontend/package.json ./app/frontend/package.json
COPY packages/shared/package.json ./packages/shared/package.json
# si tienes otros paquetes que participan en el workspace, agrégalos igual aquí

# instalar dependencias del workspace (frozen para consistencia)
# --ignore-scripts se evita solo si necesitas postinstall; dejamos scripts activados por defecto
RUN pnpm install

# cambiar a la carpeta del frontend (donde está el código)
WORKDIR /app/app/frontend

# Exponer puerto de desarrollo (Next dev o start configurado en package.json)
EXPOSE 3001

# usamos --filter para asegurarnos de ejecutar el script del paquete frontend dentro del workspace
CMD ["pnpm", "--filter", "frontend", "start"]
