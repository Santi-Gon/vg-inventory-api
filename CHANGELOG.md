# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-01
### Añadido - Expansión de Pruebas Unitarias y Endpoint PUT
- **Estado de la versión:** Estable y funcionando.
- **Resumen:** Se añadió un endpoint de actualización (PUT) para cumplir con todos los verbos HTTP y se incrementó la cobertura a 15 escenarios de prueba unitaria.
- **Detalles:** 
  - Se agregó el endpoint `PUT /videojuegos/:id` para permitir la modificación de atributos.
  - La suite de pruebas en `app.controller.spec.ts` se expandió masivamente para validar 15 casos de uso.
  - Se añadieron múltiples escenarios de errores provocados por el usuario (Edge Cases), como borrar algo inexistente, referenciar llaves foráneas falsas y validar respuestas `404 Not Found` en lugar de caídas del servidor.
  - Se generó y actualizó el archivo `Reporte_Pruebas.md` documentando los 15 resultados obtenidos en verde.

## [1.0.1] - 2026-10-01
### Añadido - Pruebas Unitarias al Controller
- **Estado de la versión:** Estable y funcionando.
- **Resumen:** Se añadió el archivo de pruebas unitarias (`app.controller.spec.ts`) para el controlador principal (`AppController`), utilizando Jest. 
- **Detalles:** 
  - Se configuraron los tests mockeando los repositorios de la base de datos (Categorías, Plataformas y Videojuegos) de manera que las pruebas jamás toquen la base de datos real.
  - Se definieron diccionarios de funciones (mocks) para simular los métodos como `find`, `create`, `save`, `delete` y `findOne`.
  - Se incluyeron pruebas de casos de éxito (código 200) y de errores previstos, como solicitar un videojuego que no existe (retornando 404 y un mensaje específico).
  - Se instalaron las dependencias de desarrollo de Jest, Supertest, y las herramientas de testing para NestJS.

## [1.0.0] - Fecha de inicio
### Añadido - API de Inventario de Videojuegos
- **Estado de la versión:** Estable y funcionando.
- **Resumen:** Versión inicial del proyecto con endpoints para crear, leer y borrar videojuegos, plataformas y categorías.
- **Detalles:** 
  - Se implementó en NestJS con SQLite y TypeORM.
  - Endpoints construidos para todas las entidades.
  - Funcionalidad de backup y borrado completo de la base de datos (Bonus).
