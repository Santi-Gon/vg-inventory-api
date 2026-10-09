# 🎮 VG Inventory API - CI/CD DevOps Project

Este repositorio contiene la implementación de una **API REST** para una tienda de videojuegos, desarrollada como proyecto integrador para la materia de DevOps. Se enfoca fuertemente en la automatización, pruebas y despliegue continuo sin tiempo de inactividad.

## 🏗 Arquitectura del Proyecto

La infraestructura automatizada se basa en las siguientes tecnologías:
- **Backend:** NestJS (Node.js) + TypeScript
- **Base de Datos:** SQLite (`better-sqlite3`)
- **Contenedorización:** Docker (Multi-stage builds)
- **CI/CD:** GitHub Actions
- **Infraestructura Cloud:** AWS EC2 (Ubuntu Server)
- **Registry:** Docker Hub

### Flujo CI/CD Automatizado
1. **Push a `main`:** Dispara el workflow de GitHub Actions.
2. **Continuous Integration (CI):** Se levanta un entorno `ubuntu-latest`, se instalan dependencias y se ejecutan las pruebas automatizadas con Jest, asegurando que la **cobertura de código sea ≥ 70%**.
3. **Delivery (CD - Build & Push):** Si los tests pasan, se hace login en Docker Hub usando GitHub Secrets, se construye la imagen a partir del `Dockerfile` y se empuja a Docker Hub con los tags `latest` y el SHA del commit.
4. **Deployment (CD - Deploy):** GitHub Actions se conecta por SSH de forma segura al servidor EC2, detiene la versión anterior del contenedor, descarga la nueva imagen y la pone en ejecución en los puertos especificados.

## 🚀 Despliegue Local con Docker

Si deseas correr el proyecto localmente sin instalar Node.js:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Santi-Gon/vg-inventory-api.git
   cd vg-inventory-api
   ```

2. Construye la imagen Docker localmente:
   ```bash
   docker build -t vg-inventory:local .
   ```

3. Ejecuta el contenedor:
   ```bash
   docker run -d -p 8080:80 -p 6061:6061 --name my-vg-api vg-inventory:local
   ```

4. Prueba la API en tu navegador o cliente HTTP:
   ```
   http://localhost:8080/api/videojuegos
   ```

## ⚙️ Configuración para Producción (AWS & GitHub Actions)

Para que el pipeline funcione, el repositorio debe contar con los siguientes **GitHub Secrets**:

- `DOCKER_USERNAME`: Usuario de Docker Hub.
- `DOCKER_PASSWORD`: Personal Access Token (PAT) de Docker Hub.
- `EC2_HOST`: IP pública de la instancia AWS EC2.
- `EC2_USER`: Usuario SSH (`ubuntu`).
- `EC2_SSH_KEY`: Llave privada `.pem` proporcionada por AWS.

### Configuración del Servidor (EC2)
El servidor EC2 debe ser Ubuntu, tener Docker instalado y reglas de Security Group permitiendo:
- Puerto `22` (TCP) para conexiones SSH (GitHub Actions).
- Puerto `80` (TCP) para tráfico HTTP normal.
- Puerto `8080` (TCP) apuntando al puerto 80 del contenedor.
- Puerto `6061` (TCP) para el servidor Socket TCP.

## 📌 Endpoints Principales

- `GET /api/videojuegos`: Lista todos los juegos.
- `POST /api/videojuegos`: Crea un nuevo juego.
- `GET /api/categorias`: Lista categorías.
- `POST /api/categorias`: Crea categoría.
- `GET /api/plataformas`: Lista plataformas.
- `POST /api/plataformas`: Crea plataforma.
