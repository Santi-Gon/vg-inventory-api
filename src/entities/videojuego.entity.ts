import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { Plataforma } from './plataforma.entity';

@Entity()
export class Videojuego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ nullable: true })
  desarrollador: string;

  @Column({ nullable: true })
  anioLanzamiento: number;

  @ManyToOne(() => Categoria, (cat) => cat.videojuegos, { onDelete: 'SET NULL', nullable: true, eager: false })
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria;

  @ManyToOne(() => Plataforma, (plat) => plat.videojuegos, { onDelete: 'SET NULL', nullable: true, eager: false })
  @JoinColumn({ name: 'plataformaId' })
  plataforma: Plataforma;
}
