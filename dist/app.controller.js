"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_entity_1 = require("./entities/categoria.entity");
const videojuego_entity_1 = require("./entities/videojuego.entity");
const plataforma_entity_1 = require("./entities/plataforma.entity");
const fs = require("fs");
const path = require("path");
let AppController = class AppController {
    constructor(categoriaRepo, videojuegoRepo, plataformaRepo) {
        this.categoriaRepo = categoriaRepo;
        this.videojuegoRepo = videojuegoRepo;
        this.plataformaRepo = plataformaRepo;
    }
    ok(data) {
        return {
            statusCode: 200,
            data: Array.isArray(data) ? data : [data],
        };
    }
    async getCategorias() {
        const data = await this.categoriaRepo.find();
        return this.ok(data);
    }
    async crearCategoria(body) {
        const nueva = this.categoriaRepo.create(body);
        const guardada = await this.categoriaRepo.save(nueva);
        return this.ok(guardada);
    }
    async borrarCategoria(id) {
        await this.categoriaRepo.delete(id);
        return this.ok({ mensaje: `Categoría con id ${id} eliminada correctamente` });
    }
    async getPlataformas() {
        const data = await this.plataformaRepo.find();
        return this.ok(data);
    }
    async crearPlataforma(body) {
        const nueva = this.plataformaRepo.create(body);
        const guardada = await this.plataformaRepo.save(nueva);
        return this.ok(guardada);
    }
    async getVideojuegos() {
        const data = await this.videojuegoRepo.find({
            relations: { categoria: true, plataforma: true },
        });
        return this.ok(data);
    }
    async getVideojuego(id) {
        const data = await this.videojuegoRepo.findOne({
            where: { id },
            relations: { categoria: true, plataforma: true },
        });
        if (!data)
            return { statusCode: 404, data: [{ mensaje: 'Videojuego no encontrado' }] };
        return this.ok(data);
    }
    async crearVideojuego(body) {
        const videojuego = new videojuego_entity_1.Videojuego();
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
    async borrarVideojuego(id) {
        await this.videojuegoRepo.delete(id);
        return this.ok({ mensaje: `Videojuego con id ${id} eliminado correctamente` });
    }
    async backupDB() {
        const dbPath = path.join(process.cwd(), 'database.sqlite');
        const backupPath = path.join(process.cwd(), `backup_${Date.now()}.sqlite`);
        if (fs.existsSync(dbPath)) {
            fs.copyFileSync(dbPath, backupPath);
            return this.ok({ mensaje: 'Backup creado exitosamente', archivo: backupPath });
        }
        return { statusCode: 404, data: [{ mensaje: 'No existe base de datos para respaldar' }] };
    }
    async vaciarDB() {
        await this.videojuegoRepo.query('DELETE FROM videojuego');
        await this.categoriaRepo.query('DELETE FROM categoria');
        await this.plataformaRepo.query('DELETE FROM plataforma');
        return this.ok({ mensaje: 'Base de datos vaciada completamente' });
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('categorias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCategorias", null);
__decorate([
    (0, common_1.Post)('categorias'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "crearCategoria", null);
__decorate([
    (0, common_1.Delete)('categorias/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "borrarCategoria", null);
__decorate([
    (0, common_1.Get)('plataformas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPlataformas", null);
__decorate([
    (0, common_1.Post)('plataformas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "crearPlataforma", null);
__decorate([
    (0, common_1.Get)('videojuegos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getVideojuegos", null);
__decorate([
    (0, common_1.Get)('videojuegos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getVideojuego", null);
__decorate([
    (0, common_1.Post)('videojuegos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "crearVideojuego", null);
__decorate([
    (0, common_1.Delete)('videojuegos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "borrarVideojuego", null);
__decorate([
    (0, common_1.Post)('db/backup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "backupDB", null);
__decorate([
    (0, common_1.Delete)('db/clear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "vaciarDB", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __param(1, (0, typeorm_1.InjectRepository)(videojuego_entity_1.Videojuego)),
    __param(2, (0, typeorm_1.InjectRepository)(plataforma_entity_1.Plataforma)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppController);
//# sourceMappingURL=app.controller.js.map