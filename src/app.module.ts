import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Categoria } from './entities/categoria.entity';
import { Videojuego } from './entities/videojuego.entity';
import { Plataforma } from './entities/plataforma.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [Categoria, Videojuego, Plataforma],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Categoria, Videojuego, Plataforma]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
