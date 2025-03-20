import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardsRepository } from './repositories/cards.repository';
import { CardsService } from './services/cards.service';
import { CardsController } from './controllers/cards.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    ProfilesModule,
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
  exports: [CardsService, CardsRepository],
})
export class CardsModule {} 