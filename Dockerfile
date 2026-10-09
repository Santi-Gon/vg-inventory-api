# ─────────────────────────────────────────────
# STAGE 1: Builder
# Instala deps, compila TypeScript y better-sqlite3
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

# Herramientas necesarias para compilar better-sqlite3 (módulo nativo)
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copiar solo los archivos de dependencias primero (mejor uso del caché de Docker)
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para poder compilar)
RUN npm ci --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Compilar TypeScript → genera la carpeta /dist
RUN npm run build

# ─────────────────────────────────────────────
# STAGE 2: Production
# Imagen final ligera, solo con lo necesario para correr
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

# Herramientas runtime necesarias para better-sqlite3 en producción
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copiar package.json para instalar solo dependencias de producción
COPY package.json package-lock.json ./

# Instalar SOLO dependencias de producción (más ligero)
RUN npm ci --omit=dev --legacy-peer-deps

# Copiar el artefacto compilado desde el stage builder
COPY --from=builder /usr/src/app/dist ./dist

# Puerto HTTP de la API REST
EXPOSE 80

# Puerto del servidor Socket TCP
EXPOSE 6061

# La app leerá la variable PORT; se fija en 80 para producción
ENV PORT=80
ENV NODE_ENV=production

# Arrancar la app compilada
CMD ["node", "dist/main"]
