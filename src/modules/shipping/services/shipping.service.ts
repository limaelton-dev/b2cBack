import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShippingCalculationResponseDto } from '../dtos/shipping-calculation-response.dto';
import { ShippingItemDto } from '../dtos/shipping-item.dto';
import { TrackingInfoDto } from '../dtos/tracking-info.dto';
import { ShippingProviderInterface } from '../interfaces/shipping-provider.interface';
import { CorreiosProviderService } from './providers/correios-provider.service';

/**
 * Serviço principal de frete
 * Gerencia os diferentes provedores de frete disponíveis
 */
@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  private readonly providers = new Map<string, ShippingProviderInterface>();
  private readonly defaultProviderID: string = 'correios';

  constructor(
    private readonly configService: ConfigService,
    private readonly correiosProvider: CorreiosProviderService,
  ) {
    // Registrar provedores disponíveis
    this.registerProviders();
  }

  /**
   * Registra os provedores de frete disponíveis
   */
  private registerProviders(): void {
    this.logger.log('Registrando provedores de frete');
    this.providers.set(this.correiosProvider.getProviderId(), this.correiosProvider);
  }

  /**
   * Lista todos os provedores de frete disponíveis
   */
  getAvailableProviders(): { id: string; name: string }[] {
    return Array.from(this.providers.values()).map(provider => ({
      id: provider.getProviderId(),
      name: provider.getProviderName()
    }));
  }

  /**
   * Obtém um provedor de frete pelo ID
   */
  getProvider(providerId: string): ShippingProviderInterface {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new NotFoundException(`Provedor de frete com ID ${providerId} não encontrado`);
    }
    return provider;
  }

  /**
   * Calcula o frete usando o provedor especificado
   */
  async calculateShipping(
    providerId: string = this.defaultProviderID,
    originZipCode: string,
    destinationZipCode: string,
    items: ShippingItemDto[]
  ): Promise<ShippingCalculationResponseDto> {
    try {
      this.logger.log(`Calculando frete com provedor ${providerId}`);
      const provider = this.getProvider(providerId);
      return await provider.calculateShipping(originZipCode, destinationZipCode, items);
    } catch (error) {
      this.logger.error(`Erro ao calcular frete: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Erro ao calcular frete',
      };
    }
  }

  /**
   * Obtém informações de rastreamento usando o provedor especificado
   */
  async getTrackingInfo(
    providerId: string = this.defaultProviderID,
    trackingCode: string
  ): Promise<TrackingInfoDto> {
    try {
      this.logger.log(`Consultando rastreamento do código ${trackingCode} com provedor ${providerId}`);
      const provider = this.getProvider(providerId);
      
      if (!provider.getTrackingInfo) {
        return {
          success: false,
          message: `O provedor ${provider.getProviderName()} não suporta rastreamento`,
          trackingCode
        };
      }
      
      return await provider.getTrackingInfo(trackingCode);
    } catch (error) {
      this.logger.error(`Erro ao consultar rastreamento: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Erro ao consultar rastreamento',
        trackingCode
      };
    }
  }
} 