import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { Videojuego } from './entities/videojuego.entity';
import { Plataforma } from './entities/plataforma.entity';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api')
export class AppController {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepo: Repository<Categoria>,

    @InjectRepository(Videojuego)
    private videojuegoRepo: Repository<Videojuego>,

    @InjectRepository(Plataforma)
    private plataformaRepo: Repository<Plataforma>,
  ) {}

  // Respuesta estándar requerida por el profesor
  private ok(data: any) {
    return {
      statusCode: 200,
      data: Array.isArray(data) ? data : [data],
    };
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 1: GET todas las categorías
  // ─────────────────────────────────────────────
  @Get('categorias')
  async getCategorias() {
    const data = await this.categoriaRepo.find();
    return this.ok(data);
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 2: POST crear una categoría
  // ─────────────────────────────────────────────
  @Post('categorias')
  async crearCategoria(@Body() body: { nombre: string; descripcion?: string }) {
    const nueva = this.categoriaRepo.create(body);
    const guardada = await this.categoriaRepo.save(nueva);
    return this.ok(guardada);
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 3: DELETE eliminar una categoría
  // ─────────────────────────────────────────────
  @Delete('categorias/:id')
  async borrarCategoria(@Param('id', ParseIntPipe) id: number) {
    await this.categoriaRepo.delete(id);
    return this.ok({ mensaje: `Categoría con id ${id} eliminada correctamente` });
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 4: GET todas las plataformas
  // ─────────────────────────────────────────────
  @Get('plataformas')
  async getPlataformas() {
    const data = await this.plataformaRepo.find();
    return this.ok(data);
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 5: POST crear una plataforma
  // ─────────────────────────────────────────────
  @Post('plataformas')
  async crearPlataforma(@Body() body: { nombre: string }) {
    const nueva = this.plataformaRepo.create(body);
    const guardada = await this.plataformaRepo.save(nueva);
    return this.ok(guardada);
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 6: GET todos los videojuegos
  // ─────────────────────────────────────────────
  @Get('videojuegos')
  async getVideojuegos() {
    const data = await this.videojuegoRepo.find({
      relations: { categoria: false, plataforma: true },
  });
    return this.ok({data:data} );
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 7: GET un videojuego por ID
  // ─────────────────────────────────────────────
  @Get('videojuegos/:id')
  async getVideojuego(@Param('id', ParseIntPipe) id: number) {
    const data = await this.videojuegoRepo.findOne({
      where: { id },
      relations: { categoria: true, plataforma: true },
    });
    if (!data) return { statusCode: 404, data: [{ mensaje: 'Videojuego no encontrado' }] };
    return this.ok(data);
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 8: POST crear un videojuego
  // ─────────────────────────────────────────────
  @Post('videojuegos')
  async crearVideojuego(
    @Body()
    body: {
      titulo: string;
      precio: number;
      desarrollador?: string;
      anioLanzamiento?: number;
      categoriaId?: number;
      plataformaId?: number;
    },
  ) {
    const videojuego = new Videojuego();
    videojuego.titulo = body.titulo;
    videojuego.precio = body.precio;
    videojuego.desarrollador = body.desarrollador || null;
    videojuego.anioLanzamiento = body.anioLanzamiento || null;

    if (body.categoriaId) {
      videojuego.categoria = await this.categoriaRepo.findOne({ where: { id: body.categoriaId } });
    }
    if (body.plataformaId) {
      videojuego.plataforma = await this.plataformaRepo.findOne({ where: { id: body.plataformaId } });
    }

    const guardado = await this.videojuegoRepo.save(videojuego);
    return this.ok(guardado);
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 9: PUT actualizar un videojuego
  // ─────────────────────────────────────────────
  @Put('videojuegos/:id')
  async actualizarVideojuego(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      titulo?: string;
      precio?: number;
      desarrollador?: string;
      anioLanzamiento?: number;
    },
  ) {
    const videojuego = await this.videojuegoRepo.findOne({ where: { id } });
    if (!videojuego) {
      return { statusCode: 404, data: [{ mensaje: 'Videojuego no encontrado para actualizar' }] };
    }
    
    if (body.titulo) videojuego.titulo = body.titulo;
    if (body.precio) videojuego.precio = body.precio;
    if (body.desarrollador) videojuego.desarrollador = body.desarrollador;
    if (body.anioLanzamiento) videojuego.anioLanzamiento = body.anioLanzamiento;

    const actualizado = await this.videojuegoRepo.save(videojuego);
    return this.ok(actualizado);
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 9: DELETE eliminar un videojuego
  // ─────────────────────────────────────────────
  @Delete('videojuegos/:id')
  async borrarVideojuego(@Param('id', ParseIntPipe) id: number) {
    await this.videojuegoRepo.delete(id);
    return this.ok({ mensaje: `Videojuego con id ${id} eliminado correctamente` });
  }

  // ─────────────────────────────────────────────
  // ENDPOINT 10: POST hacer backup de la BD
  // ─────────────────────────────────────────────
  @Post('db/backup')
  async backupDB() {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    const backupPath = path.join(process.cwd(), `backup_${Date.now()}.sqlite`);
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      return this.ok({ mensaje: 'Backup creado exitosamente', archivo: backupPath });
    }
    return { statusCode: 404, data: [{ mensaje: 'No existe base de datos para respaldar' }] };
  }

  // ─────────────────────────────────────────────
  // ENDPOINT BONUS: DELETE vaciar toda la BD
  // ─────────────────────────────────────────────
  @Delete('db/clear')
  async vaciarDB() {
    await this.videojuegoRepo.query('DELETE FROM videojuego');
    await this.categoriaRepo.query('DELETE FROM categoria');
    await this.plataformaRepo.query('DELETE FROM plataforma');
    return this.ok({ mensaje: 'Base de datos vaciada completamente' });
  }
}
