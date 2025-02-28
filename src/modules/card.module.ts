import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../models/card/card';
import { CardService } from '../services/card/card.service';
import { CardController } from '../controllers/card/card.controller';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    ProfileModule
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {} 