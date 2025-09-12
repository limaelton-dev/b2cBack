import { Module } from "@nestjs/common";
import { BrandsController } from "./controllers/brands.controller";
import { BrandsService } from "./services/brands.service";
import { BrandsRepository } from "./repositories/brands.repository";
import { AnyMarketModule } from "src/shared/anymarket";


@Module({
  imports: [AnyMarketModule],
  controllers: [BrandsController],
  providers: [BrandsService, BrandsRepository],
  exports: [BrandsService],
})
export class BrandsModule {}
