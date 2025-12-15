import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AnyMarketConfigService } from './config/any-market.config.service';
import { AnyMarketApiProvider } from './any-market-api.provider';
import { PaginationHelperService } from './pagination/pagination-helper.service';
import { SkuMarketplaceRepository } from './repositories/sku-marketplace.repository';
import { MarketplaceProductExtractorService } from './services/marketplace-product-extractor.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    AnyMarketConfigService,
    AnyMarketApiProvider,
    PaginationHelperService,
    SkuMarketplaceRepository,
    MarketplaceProductExtractorService,
  ],
  exports: [
    AnyMarketConfigService,
    AnyMarketApiProvider,
    PaginationHelperService,
    SkuMarketplaceRepository,
    MarketplaceProductExtractorService,
  ],
})
export class AnyMarketModule {}
