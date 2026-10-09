# Reporte de Pruebas Unitarias - API Inventario de Videojuegos

**Asignatura:** DevOps  
**Fecha:** 1 de Octubre de 2026

---

## 1. Introducción
El presente reporte detalla la implementación y ejecución de las pruebas unitarias realizadas sobre la API de Inventario de Videojuegos, la cual fue desarrollada bajo el marco de **NestJS** (utilizando Node.js y Express internamente) junto con **TypeORM** y **SQLite**. 

El objetivo principal de estas pruebas es validar la correcta lógica de negocio de los distintos endpoints (`GET`, `POST`, `PUT`, `DELETE`), así como evaluar la respuesta del sistema ante fallos o usos indebidos por parte del usuario (User Error Scenarios).

---

## 2. Herramientas Utilizadas
Acorde a los lineamientos, no se utilizaron conexiones a bases de datos reales durante las pruebas. Se integraron herramientas estándares del ecosistema JavaScript/TypeScript:
- **Jest:** Framework de pruebas para JavaScript/TypeScript, utilizado para la estructura de los tests (`describe`, `it`), aserciones (`expect`), y simulación de objetos (`mocks`).
- **@nestjs/testing:** Módulo oficial para aislar controladores y servicios sin levantar todo el framework.
- **ts-jest:** Para poder analizar y ejecutar código TypeScript de forma nativa sin previa compilación manual.

---

## 3. Metodología de Mocks (Simulaciones)
Se diseñó un diccionario de funciones simuladas (Mocks) para interceptar las llamadas que el controlador hace a la base de datos (repositorios de `Categoria`, `Plataforma` y `Videojuego`). Funciones como `find`, `create`, `save`, `delete` y `findOne` fueron reemplazadas con simulaciones en la memoria local, devolviendo datos controlados. Esto garantiza que las pruebas:
1. Sean deterministas y veloces.
2. Cumplan el requisito estricto de **no interactuar jamás con una base de datos real** al realizar pruebas unitarias.

---

## 4. Escenarios Probados (Endpoints)
Se desarrolló una suite completa de **15 pruebas unitarias** que abarcan más de los escenarios solicitados, cubriendo todos los verbos HTTP clave (`GET`, `POST`, `PUT`, `DELETE`).

### 4.1 Pruebas de Éxito (Happy Path)
1. **GET `/categorias`:** Se valida que retorne un arreglo de categorías y su respectivo código HTTP 200.
2. **GET `/plataformas`:** Se valida la correcta obtención de plataformas y código 200.
3. **GET `/videojuegos`:** Se confirma el retorno del catálogo completo de juegos (200).
4. **POST `/categorias`:** Se simula la inyección de una nueva categoría y se comprueba el retorno del objeto creado (200).
5. **POST `/plataformas`:** Se simula la creación exitosa de una plataforma (200).
6. **POST `/videojuegos`:** Valida la lógica de guardado correcto de un videojuego en la plataforma (200).
7. **PUT `/videojuegos/:id`:** Se creó este nuevo endpoint para cumplir con el requisito de actualización. Verifica que se modifiquen atributos específicos (ej. precio) correctamente (200).
8. **DELETE `/categorias/:id`:** Valida la respuesta tras solicitar la eliminación de una categoría existente.
9. **DELETE `/videojuegos/:id`:** Comprueba que la lógica de borrado de juegos regrese código 200.
10. **DELETE `/db/clear`:** Verifica que el endpoint "Bonus" para vaciar la BD mande a llamar los queríes correctos.

### 4.2 Pruebas de Fallo del Usuario (Edge Cases)
Como se requería, se contemplaron escenarios de errores intencionales para verificar la resiliencia del software:
11. **Fallo en GET `/videojuegos/:id`:** El usuario inserta en la URL un ID que no pertenece a ningún registro. **Resultado esperado:** Retorno de código HTTP `404 (Not Found)` con mensaje personalizado `"Videojuego no encontrado"`.
12. **Fallo en PUT `/videojuegos/:id`:** El usuario intenta enviar un paquete de actualización sobre un juego inexistente o eliminado. **Resultado esperado:** Bloqueo de la actualización y código HTTP `404` controlado.
13. **Fallo en POST `/db/backup`:** Escenario simulado donde el archivo subyacente falla al intentar ser copiado.
14. **Fallo en POST `/videojuegos` (Falsa Relación):** El usuario manda un ID de categoría que no existe. La aplicación es capaz de detectar la inexistencia y procesar la petición sin tronar, salvaguardando la integridad (ignora la relación).
15. **Fallo en DELETE `/videojuegos/:id` (Borrar inexistente):** El usuario intenta hacer DELETE a algo previamente borrado, la respuesta del TypeORM es `{ affected: 0 }` y el endpoint responde correctamente sin causar excepciones graves.

---

## 5. Resultados Obtenidos
Tras ejecutar el comando `npm run test` a través del motor de Jest, los resultados arrojados en la consola son un **100% de éxito (15 de 15 pasados).**

## 6. Conclusión
La aplicación cumple con los estándares modernos de integración continua para DevOps. Al aislar la base de datos se garantiza una suite de testing escalable y eficiente, y mediante el testeo exhaustivo de más de 10 escenarios (incluyendo fallos), se protege a la API ante el comportamiento impredecible del usuario, elevando su confiabilidad en un entorno de producción.
