import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as net from 'net';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './entities/videojuego.entity';
import { Categoria } from './entities/categoria.entity';
import { Plataforma } from './entities/plataforma.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Tienda VG-Inventory corriendo en el puerto ${port}`);

  // Obtener los repositorios reales de la base de datos SQLite
  const videojuegoRepo = app.get<Repository<Videojuego>>(getRepositoryToken(Videojuego));
  const categoriaRepo = app.get<Repository<Categoria>>(getRepositoryToken(Categoria));
  const plataformaRepo = app.get<Repository<Plataforma>>(getRepositoryToken(Plataforma));

  // --- INICIO DEL SERVIDOR SOCKET TCP (Puerto 6061) ---
  const socketServer = net.createServer((socket) => {
    console.log('Cliente TCP conectado');

    socket.on('data', async (data) => {
      const mensaje = data.toString().trim();
      console.log(`Socket recibió: ${mensaje}`);

      const insertRegex = /^\{insert:(.+)\}$/s;
      const getRegex = /^\{get:(.+)\}$/s;

      try {
        if (insertRegex.test(mensaje)) {
          const contenido = mensaje.match(insertRegex)[1];
          const elemento = JSON.parse(contenido);

          // Detectar a qué tabla insertar según los campos del JSON
          if (elemento.titulo !== undefined && elemento.precio !== undefined) {
            // Es un VIDEOJUEGO
            const vj = new Videojuego();
            vj.titulo = elemento.titulo;
            vj.precio = elemento.precio;
            vj.desarrollador = elemento.desarrollador || null;
            vj.anioLanzamiento = elemento.anioLanzamiento || null;

            if (elemento.categoriaId) {
              vj.categoria = await categoriaRepo.findOne({ where: { id: elemento.categoriaId } });
            }
            if (elemento.plataformaId) {
              vj.plataforma = await plataformaRepo.findOne({ where: { id: elemento.plataformaId } });
            }

            const guardado = await videojuegoRepo.save(vj);
            socket.write(JSON.stringify({ statusCode: 200, data: [guardado] }) + '\n');

          } else if (elemento.nombre !== undefined && elemento.descripcion !== undefined) {
            // Es una CATEGORIA
            const cat = categoriaRepo.create(elemento);
            const guardada = await categoriaRepo.save(cat);
            socket.write(JSON.stringify({ statusCode: 200, data: [guardada] }) + '\n');

          } else if (elemento.nombre !== undefined) {
            // Es una PLATAFORMA
            const plat = plataformaRepo.create(elemento);
            const guardada = await plataformaRepo.save(plat);
            socket.write(JSON.stringify({ statusCode: 200, data: [guardada] }) + '\n');

          } else {
            socket.write(JSON.stringify({ statusCode: 400, error: 'No se pudo determinar la entidad. Usa campos como titulo+precio (videojuego), nombre+descripcion (categoria), o nombre (plataforma).' }) + '\n');
          }

        } else if (getRegex.test(mensaje)) {
          const param = mensaje.match(getRegex)[1];

          // Si el parámetro es un nombre de entidad, devolver todos los registros
          if (param.toLowerCase() === 'videojuegos') {
            const datos = await videojuegoRepo.find({ relations: { categoria: true, plataforma: true } });
            socket.write(JSON.stringify({ statusCode: 200, data: datos }) + '\n');

          } else if (param.toLowerCase() === 'categorias') {
            const datos = await categoriaRepo.find();
            socket.write(JSON.stringify({ statusCode: 200, data: datos }) + '\n');

          } else if (param.toLowerCase() === 'plataformas') {
            const datos = await plataformaRepo.find();
            socket.write(JSON.stringify({ statusCode: 200, data: datos }) + '\n');

          } else if (param.startsWith('videojuegos/')) {
            // Buscar un videojuego por ID: {get:videojuegos/1}
            const id = parseInt(param.split('/')[1]);
            const vj = await videojuegoRepo.findOne({ where: { id }, relations: { categoria: true, plataforma: true } });
            if (vj) {
              socket.write(JSON.stringify({ statusCode: 200, data: [vj] }) + '\n');
            } else {
              socket.write(JSON.stringify({ statusCode: 404, data: [{ mensaje: 'Videojuego no encontrado' }] }) + '\n');
            }

          } else {
            socket.write(JSON.stringify({ statusCode: 400, error: 'Usa {get:videojuegos}, {get:categorias}, {get:plataformas} o {get:videojuegos/ID}' }) + '\n');
          }

        } else {
          socket.write(JSON.stringify({ statusCode: 400, error: 'Formato no reconocido. Usa {insert:<JSON>} o {get:<entidad>}' }) + '\n');
        }
      } catch (err) {
        socket.write(JSON.stringify({ statusCode: 500, error: err.message }) + '\n');
      }
    });

    socket.on('end', () => {
      console.log('Cliente TCP desconectado');
    });
  });

  socketServer.listen(6061, () => {
    console.log('Servidor Socket TCP corriendo en el puerto 6061');
  });
  // --- FIN DEL SERVIDOR SOCKET TCP ---
}
bootstrap();
