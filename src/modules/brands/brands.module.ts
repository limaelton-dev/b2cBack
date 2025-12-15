import { Module, Logger } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";
import { BrandsController } from "./controllers/brands.controller";
import { BrandsService } from "./services/brands.service";
import { BrandsRepository } from "./repositories/brands.repository";
import { AnyMarketModule } from "src/shared/anymarket";

const logger = new Logger('BrandsCacheModule');
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
          logger.log(`Cache Redis (Brands) conectado em ${redisHost}:${redisPort}`);
          return { store, ttl: TWELVE_HOURS_MS };
        } catch {
          logger.warn(`Redis indisponível. Brands usando cache em memória.`);
          return { ttl: TWELVE_HOURS_MS };
        }
      },
    }),
  ],
  controllers: [BrandsController],
  providers: [BrandsService, BrandsRepository],
  exports: [BrandsService],
})
export class BrandsModule {}
