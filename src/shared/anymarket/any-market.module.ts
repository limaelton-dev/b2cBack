import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AnyMarketConfigService } from './config/any-market.config.service';
import { AnyMarketApiProvider } from './any-market-api.provider';
import { PaginationHelperService } from './pagination/pagination-helper.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AnyMarketConfigService, AnyMarketApiProvider, PaginationHelperService],
  exports: [AnyMarketConfigService, AnyMarketApiProvider, PaginationHelperService],
})
export class AnyMarketModule {}
