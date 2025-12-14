import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AnyMarketApiProvider } from '../../../../shared/anymarket/any-market-api.provider';
import { AnyMarketConfigService } from '../../../../shared/anymarket/config/any-market.config.service';
import {
  AnyMarketFreightRequest,
  AnyMarketFreightProduct,
  AnyMarketFreightResponse,
} from '../../../../shared/anymarket/interfaces/freight.interface';
import { ShippingResponseDto, ShippingServiceOption } from '../../dtos/shipping-response.dto';

const DEFAULT_TIMEOUT = 3000;

const FALLBACK_DIMENSIONS = {
  height: 2,
  width: 11,
  length: 16,
  weight: 300,
};

export interface ShippingItem {
  skuId: number;
  partnerId: string;
  quantity: number;
}

interface SkuDimensions {
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
}

@Injectable()
export class AnyMarketProviderService {
  private readonly logger = new Logger(AnyMarketProviderService.name);

  constructor(
    private readonly api: AnyMarketApiProvider,
    private readonly config: AnyMarketConfigService,
  ) {}

  private normalizeZipCode(zipCode: string): string {
    return zipCode.replace(/\D/g, '');
  }

  private validateAndGetDimensions(skuId: number, dimensions?: SkuDimensions): AnyMarketFreightProduct['dimensions'] {
    const height = dimensions?.height;
    const width = dimensions?.width;
    const length = dimensions?.length;
    const weight = dimensions?.weight;

    const missingFields: string[] = [];

    if (!height || height <= 0) missingFields.push('height');
    if (!width || width <= 0) missingFields.push('width');
    if (!length || length <= 0) missingFields.push('length');
    if (!weight || weight <= 0) missingFields.push('weight');

    if (missingFields.length > 0) {
      this.logger.warn(
        `SKU ${skuId}: Dimensões inválidas ou ausentes [${missingFields.join(', ')}]. Usando fallback: ${JSON.stringify(FALLBACK_DIMENSIONS)}`,
      );

      return {
        height: height && height > 0 ? height : FALLBACK_DIMENSIONS.height,
        width: width && width > 0 ? width : FALLBACK_DIMENSIONS.width,
        length: length && length > 0 ? length : FALLBACK_DIMENSIONS.length,
        weight: weight && weight > 0 ? weight : FALLBACK_DIMENSIONS.weight,
      };
    }

    return { height, width, length, weight };
  }

  private async fetchSkuDimensions(skuId: number): Promise<SkuDimensions | null> {
    try {
      const sku = await this.api.get<any>(`/skus/${skuId}`);
      if (!sku) return null;

      return {
        height: sku.height,
        width: sku.width,
        length: sku.length,
        weight: sku.weight,
      };
    } catch (error) {
      this.logger.warn(`Falha ao buscar dimensões do SKU ${skuId}: ${error.message}`);
      return null;
    }
  }

  private async toFreightProduct(item: ShippingItem): Promise<AnyMarketFreightProduct> {
    const dimensions = await this.fetchSkuDimensions(item.skuId);
    const validatedDimensions = this.validateAndGetDimensions(item.skuId, dimensions);

    return {
      skuId: item.partnerId || String(item.skuId),
      amount: item.quantity,
      dimensions: validatedDimensions,
    };
  }

  private buildServices(response: AnyMarketFreightResponse): ShippingServiceOption[] {
    let totalPrice = 0;
    let maxDeliveryDays = 0;

    for (const product of response.products) {
      totalPrice += product.discountPrice ?? product.price;
      maxDeliveryDays = Math.max(maxDeliveryDays, product.additionalDeliveryTime || 0);
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + maxDeliveryDays);

    return [{
      serviceName: 'Frete Padrão',
      carrierName: 'AnyMarket',
      price: Math.round(totalPrice * 100) / 100,
      deliveryDays: maxDeliveryDays,
      estimatedDeliveryDate,
    }];
  }

  async calculate(destinationZipCode: string, items: ShippingItem[]): Promise<ShippingResponseDto> {
    try {
      const zipCode = this.normalizeZipCode(destinationZipCode);

      if (!/^\d{8}$/.test(zipCode)) {
        throw new BadRequestException('CEP inválido. Deve conter 8 dígitos.');
      }

      if (!items?.length) {
        throw new BadRequestException('Nenhum item para cálculo de frete.');
      }

      const marketplace = this.config.getMarketplaceName();
      const products = await Promise.all(items.map((item) => this.toFreightProduct(item)));

      const payload: AnyMarketFreightRequest = {
        zipCode,
        marketPlace: marketplace,
        timeout: DEFAULT_TIMEOUT,
        products,
      };

      this.logger.log(`Cotando frete: marketplace=${marketplace}, cep=${zipCode}, itens=${items.length}`);

      const response = await this.api.post<AnyMarketFreightResponse>('/freight/quotes', payload);

      if (!response?.products?.length) {
        return {
          success: false,
          message: 'Nenhuma cotação disponível para este destino.',
        };
      }

      const services = this.buildServices(response);

      this.logger.log(`Frete calculado: ${services.length} opção(ões), preço: R$${services[0]?.price}`);

      return {
        success: true,
        zipCode,
        services,
      };
    } catch (error) {
      this.logger.error(`Erro ao calcular frete: ${error.message}`);

      return {
        success: false,
        message: error.message || 'Erro ao calcular frete.',
      };
    }
  }
}
