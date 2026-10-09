import { Videojuego } from './videojuego.entity';
export declare class Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    videojuegos: Videojuego[];
}
