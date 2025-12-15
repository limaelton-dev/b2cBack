import { Module, Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { AnyMarketModule } from '../../shared/anymarket';

const logger = new Logger('CategoriesCacheModule');
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

@Module({
  imports: [
    AnyMarketModule,
    CacheModule.registerAsync({
      useFactory: async () => {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = Number(process.env.REDIS_PORT) || 6379;

        try {
          const store = await redisStore({
            socket: { host: redisHost, port: redisPort, connectTimeout: 3000 },
          });
          logger.log(`Cache Redis (Categories) conectado em ${redisHost}:${redisPort}`);
          return { store, ttl: TWELVE_HOURS_MS };
        } catch {
          logger.warn(`Redis indisponível. Categories usando cache em memória.`);
          return { ttl: TWELVE_HOURS_MS };
        }
      },
    }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
