import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { AnyMarketModule } from '../../shared/anymarket';

@Module({
  imports: [
    AnyMarketModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService ],
})
export class CategoriesModule {}
