import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { BrandController } from "./controllers/brands.controller";
import { BrandService } from "./services/brand.service";
import { BrandRepository } from "./repositories/brand.repository";


@Module({
  imports: [HttpModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService],
})
export class BrandModule {}
