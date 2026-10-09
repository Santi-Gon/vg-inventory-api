import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Videojuego } from './videojuego.entity';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Videojuego, (vj) => vj.categoria)
  videojuegos: Videojuego[];
}
