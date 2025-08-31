import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AnyMarketConfigService } from './config/any-market.config.service';
import { AnyMarketApiProvider } from './any-market-api.provider';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AnyMarketConfigService, AnyMarketApiProvider],
  exports: [AnyMarketConfigService, AnyMarketApiProvider],
})
export class AnyMarketModule {}
