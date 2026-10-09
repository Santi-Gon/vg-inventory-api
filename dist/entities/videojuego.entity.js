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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Videojuego = void 0;
const typeorm_1 = require("typeorm");
const categoria_entity_1 = require("./categoria.entity");
const plataforma_entity_1 = require("./plataforma.entity");
let Videojuego = class Videojuego {
};
exports.Videojuego = Videojuego;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Videojuego.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Videojuego.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Videojuego.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Videojuego.prototype, "desarrollador", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Videojuego.prototype, "anioLanzamiento", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria, (cat) => cat.videojuegos, { onDelete: 'SET NULL', nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'categoriaId' }),
    __metadata("design:type", categoria_entity_1.Categoria)
], Videojuego.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plataforma_entity_1.Plataforma, (plat) => plat.videojuegos, { onDelete: 'SET NULL', nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'plataformaId' }),
    __metadata("design:type", plataforma_entity_1.Plataforma)
], Videojuego.prototype, "plataforma", void 0);
exports.Videojuego = Videojuego = __decorate([
    (0, typeorm_1.Entity)()
], Videojuego);
//# sourceMappingURL=videojuego.entity.js.map