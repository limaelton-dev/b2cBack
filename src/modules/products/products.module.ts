import { Module, Logger } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsFilterService } from './services/products-filters.service';
import { AnyMarketModule } from '../../shared/anymarket';
import { CacheModule } from '@nestjs/cache-manager';

const logger = new Logger('CacheModule');

@Module({
  imports: [
    AnyMarketModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = Number(process.env.REDIS_PORT) || 6379;
        const ttl = Number(process.env.REDIS_TTL) || 3600000; // 1hr em ms

        try {
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: redisPort,
              connectTimeout: 3000,
            },
            // username: process.env.REDIS_USERNAME, //estamos em DEV atualmente
            // password: process.env.REDIS_PASSWORD, //estamos em DEV atualmente
          });
          logger.log(`Cache Redis conectado em ${redisHost}:${redisPort}`);
          return { store, ttl };
        } catch (error) {
          logger.warn(`Redis indisponível (${redisHost}:${redisPort}). Usando cache em memória.`);
          return { ttl };
        }
      }
    })
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    ProductsRepository, 
    ProductsFilterService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
