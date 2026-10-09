FROM node:20-alpine

# Instalar python y build tools para compilar better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copiar dependencias primero (aprovecha caché de Docker)
COPY package.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Puerto de escucha en el contenedor (el profe pide -p 8080:80)
EXPOSE 80
EXPOSE 6061

ENV PORT=80

# Correr la app compilada
CMD ["node", "dist/main"]
