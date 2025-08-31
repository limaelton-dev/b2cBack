import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { BrandController } from "./controllers/brands.controller";
import { BrandService } from "./services/brand.service";
import { BrandRepository } from "./repositories/brand.repository";
import { AnyMarketModule } from "src/shared/anymarket";


@Module({
  imports: [AnyMarketModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService],
})
export class BrandModule {}
