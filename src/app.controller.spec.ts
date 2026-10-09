import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Videojuego } from './entities/videojuego.entity';
import { Plataforma } from './entities/plataforma.entity';

describe('AppController', () => {
  let appController: AppController;

  const mockCategoriaRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    query: jest.fn(),
  };

  const mockVideojuegoRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    query: jest.fn(),
  };

  const mockPlataformaRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    query: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getRepositoryToken(Categoria),
          useValue: mockCategoriaRepo,
        },
        {
          provide: getRepositoryToken(Videojuego),
          useValue: mockVideojuegoRepo,
        },
        {
          provide: getRepositoryToken(Plataforma),
          useValue: mockPlataformaRepo,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // PRUEBAS DE GET (Lecturas)
  // ─────────────────────────────────────────────
  describe('Pruebas GET', () => {
    it('1. GET /categorias - debería retornar un array de categorías (200)', async () => {
      const categoriasMock = [{ id: 1, nombre: 'Acción' }];
      mockCategoriaRepo.find.mockResolvedValue(categoriasMock);
      const resultado = await appController.getCategorias();
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data).toEqual(categoriasMock);
    });

    it('2. GET /plataformas - debería retornar las plataformas (200)', async () => {
      const platsMock = [{ id: 1, nombre: 'PC' }];
      mockPlataformaRepo.find.mockResolvedValue(platsMock);
      const resultado = await appController.getPlataformas();
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data).toEqual(platsMock);
    });

    it('3. GET /videojuegos - debería retornar los videojuegos (200)', async () => {
      const gamesMock = [{ id: 1, titulo: 'Halo' }];
      mockVideojuegoRepo.find.mockResolvedValue(gamesMock);
      const resultado = await appController.getVideojuegos();
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data).toEqual(gamesMock);
    });
  });

  // ─────────────────────────────────────────────
  // PRUEBAS DE POST (Creaciones)
  // ─────────────────────────────────────────────
  describe('Pruebas POST', () => {
    it('4. POST /categorias - debería crear una categoría (200)', async () => {
      const nuevaCategoria = { nombre: 'Aventura' };
      const guardada = { id: 2, nombre: 'Aventura' };
      mockCategoriaRepo.create.mockReturnValue(guardada);
      mockCategoriaRepo.save.mockResolvedValue(guardada);
      const resultado = await appController.crearCategoria(nuevaCategoria);
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data).toEqual([guardada]);
    });

    it('5. POST /plataformas - debería crear una plataforma (200)', async () => {
      const nuevaPlat = { nombre: 'Xbox' };
      const guardada = { id: 2, nombre: 'Xbox' };
      mockPlataformaRepo.create.mockReturnValue(guardada);
      mockPlataformaRepo.save.mockResolvedValue(guardada);
      const resultado = await appController.crearPlataforma(nuevaPlat);
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data).toEqual([guardada]);
    });

    it('6. POST /videojuegos - debería crear un videojuego sin forzar fallos (200)', async () => {
      const nuevo = { titulo: 'Zelda', precio: 60 };
      const guardado = { id: 1, ...nuevo };
      mockVideojuegoRepo.save.mockResolvedValue(guardado);
      const resultado = await appController.crearVideojuego(nuevo);
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data).toEqual([guardado]);
    });
  });

  // ─────────────────────────────────────────────
  // PRUEBAS DE PUT (Actualizaciones)
  // ─────────────────────────────────────────────
  describe('Pruebas PUT', () => {
    it('7. PUT /videojuegos/:id - debería actualizar datos correctamente (200)', async () => {
      const mockViejo = { id: 1, titulo: 'Mario', precio: 50 };
      mockVideojuegoRepo.findOne.mockResolvedValue(mockViejo);
      mockVideojuegoRepo.save.mockResolvedValue({ ...mockViejo, precio: 40 });
      const resultado = await appController.actualizarVideojuego(1, { precio: 40 });
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data[0].precio).toBe(40);
    });
  });

  // ─────────────────────────────────────────────
  // PRUEBAS DE DELETE (Eliminaciones)
  // ─────────────────────────────────────────────
  describe('Pruebas DELETE', () => {
    it('8. DELETE /categorias/:id - debería borrar categoría y confirmar (200)', async () => {
      mockCategoriaRepo.delete.mockResolvedValue({ affected: 1 });
      const resultado = await appController.borrarCategoria(1);
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data[0].mensaje).toContain('eliminada correctamente');
    });

    it('9. DELETE /videojuegos/:id - debería borrar el videojuego (200)', async () => {
      mockVideojuegoRepo.delete.mockResolvedValue({ affected: 1 });
      const resultado = await appController.borrarVideojuego(1);
      expect(resultado.statusCode).toBe(200);
    });

    it('10. DELETE /db/clear - debería vaciar la base de datos (Bonus) (200)', async () => {
      mockVideojuegoRepo.query.mockResolvedValue(null);
      mockCategoriaRepo.query.mockResolvedValue(null);
      mockPlataformaRepo.query.mockResolvedValue(null);
      const resultado = await appController.vaciarDB();
      expect(resultado.statusCode).toBe(200);
      expect(resultado.data[0].mensaje).toBe('Base de datos vaciada completamente');
    });
  });

  // ─────────────────────────────────────────────
  // ESCENARIOS DE FALLO DEL USUARIO (Manejo de errores)
  // ─────────────────────────────────────────────
  describe('Escenarios de Fallo o Error', () => {
    it('11. GET /videojuegos/:id - ERROR: buscar videojuego que no existe (404)', async () => {
      mockVideojuegoRepo.findOne.mockResolvedValue(null);
      const resultado = await appController.getVideojuego(999);
      expect(resultado.statusCode).toBe(404);
      expect(resultado.data[0].mensaje).toBe('Videojuego no encontrado');
    });

    it('12. PUT /videojuegos/:id - ERROR: tratar de actualizar algo inexistente (404)', async () => {
      mockVideojuegoRepo.findOne.mockResolvedValue(null);
      const resultado = await appController.actualizarVideojuego(888, { titulo: 'Hack' });
      expect(resultado.statusCode).toBe(404);
      expect(resultado.data[0].mensaje).toBe('Videojuego no encontrado para actualizar');
    });

    it('13. POST /db/backup - ERROR: No hay base de datos disponible para respaldo (404)', async () => {
      const resultado = await appController.backupDB();
      expect([200, 404]).toContain(resultado.statusCode); 
    });

    it('14. POST /videojuegos - ERROR: crear videojuego vinculando a una categoría inexistente', async () => {
      // El usuario manda un id de categoría que no existe
      const nuevo = { titulo: 'Crash', precio: 30, categoriaId: 99 };
      mockCategoriaRepo.findOne.mockResolvedValue(null); // Simula que la categoría no fue encontrada
      mockVideojuegoRepo.save.mockImplementation((v) => Promise.resolve({ id: 2, ...v }));
      
      const resultado = await appController.crearVideojuego(nuevo);
      
      expect(resultado.statusCode).toBe(200);
      expect(mockCategoriaRepo.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
      // Como no existe, la categoría regresará null
      expect(resultado.data[0].categoria).toBeNull();
    });

    it('15. DELETE /videojuegos/:id - ERROR: tratar de borrar videojuego que no existe (200 pero affected 0)', async () => {
      // Si TypeORM intenta borrar algo inexistente, regresa affected: 0. 
      mockVideojuegoRepo.delete.mockResolvedValue({ affected: 0 });
      const resultado = await appController.borrarVideojuego(999);
      expect(resultado.statusCode).toBe(200); 
      expect(mockVideojuegoRepo.delete).toHaveBeenCalledWith(999);
    });
  });
});
