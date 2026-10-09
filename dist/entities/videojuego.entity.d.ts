import { Categoria } from './categoria.entity';
import { Plataforma } from './plataforma.entity';
export declare class Videojuego {
    id: number;
    titulo: string;
    precio: number;
    desarrollador: string;
    anioLanzamiento: number;
    categoria: Categoria;
    plataforma: Plataforma;
}
