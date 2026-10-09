import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Videojuego } from './videojuego.entity';

@Entity()
export class Plataforma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Videojuego, (vj) => vj.plataforma)
  videojuegos: Videojuego[];
}
