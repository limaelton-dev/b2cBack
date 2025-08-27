import { Module } from '@nestjs/common';
import { AppConfigService } from './app.config.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
