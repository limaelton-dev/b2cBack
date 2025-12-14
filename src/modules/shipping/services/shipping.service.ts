import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyMarketProviderService, ShippingItem } from './providers/anymarket-provider.service';
import { ShippingResponseDto } from '../dtos/shipping-response.dto';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly provider: AnyMarketProviderService,
  ) {}

  async calculateForCart(destinationZipCode: string, items: ShippingItem[]): Promise<ShippingResponseDto> {
    this.logger.log(`Calculando frete carrinho: ${items.length} itens para CEP ${destinationZipCode}`);
    return this.provider.calculate(destinationZipCode, items);
  }

  async calculateForProduct(skuId: number, partnerId: string, destinationZipCode: string): Promise<ShippingResponseDto> {
    this.logger.log(`Calculando frete produto: SKU ${skuId} para CEP ${destinationZipCode}`);

    const item: ShippingItem = {
      skuId,
      partnerId,
      quantity: 1,
    };

    return this.provider.calculate(destinationZipCode, [item]);
  }
}
