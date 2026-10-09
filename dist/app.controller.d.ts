import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { Videojuego } from './entities/videojuego.entity';
import { Plataforma } from './entities/plataforma.entity';
export declare class AppController {
    private categoriaRepo;
    private videojuegoRepo;
    private plataformaRepo;
    constructor(categoriaRepo: Repository<Categoria>, videojuegoRepo: Repository<Videojuego>, plataformaRepo: Repository<Plataforma>);
    private ok;
    getCategorias(): Promise<{
        statusCode: number;
        data: any[];
    }>;
    crearCategoria(body: {
        nombre: string;
        descripcion?: string;
    }): Promise<{
        statusCode: number;
        data: any[];
    }>;
    borrarCategoria(id: number): Promise<{
        statusCode: number;
        data: any[];
    }>;
    getPlataformas(): Promise<{
        statusCode: number;
        data: any[];
    }>;
    crearPlataforma(body: {
        nombre: string;
    }): Promise<{
        statusCode: number;
        data: any[];
    }>;
    getVideojuegos(): Promise<{
        statusCode: number;
        data: any[];
    }>;
    getVideojuego(id: number): Promise<{
        statusCode: number;
        data: any[];
    }>;
    crearVideojuego(body: {
        titulo: string;
        precio: number;
        desarrollador?: string;
        anioLanzamiento?: number;
        categoriaId?: number;
        plataformaId?: number;
    }): Promise<{
        statusCode: number;
        data: any[];
    }>;
    borrarVideojuego(id: number): Promise<{
        statusCode: number;
        data: any[];
    }>;
    backupDB(): Promise<{
        statusCode: number;
        data: any[];
    }>;
    vaciarDB(): Promise<{
        statusCode: number;
        data: any[];
    }>;
}
