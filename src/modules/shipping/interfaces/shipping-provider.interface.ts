import { ShippingCalculationResponseDto } from '../dtos/shipping-calculation-response.dto';
import { ShippingItemDto } from '../dtos/shipping-item.dto';
import { TrackingInfoDto } from '../dtos/tracking-info.dto';

/**
 * Interface para provedores de serviço de frete
 * Define os métodos que todos os provedores devem implementar
 */
export interface ShippingProviderInterface {
  /**
   * Obtém o identificador único do provedor de frete
   */
  getProviderId(): string;
  
  /**
   * Obtém o nome do provedor de frete
   */
  getProviderName(): string;
  
  /**
   * Calcula o frete para um conjunto de itens
   * @param originZipCode CEP de origem
   * @param destinationZipCode CEP de destino
   * @param items Itens para cálculo de frete
   */
  calculateShipping(
    originZipCode: string,
    destinationZipCode: string,
    items: ShippingItemDto[]
  ): Promise<ShippingCalculationResponseDto>;
  
  /**
   * Obtém informações de rastreamento
   * @param trackingCode Código de rastreamento
   */
  getTrackingInfo?(trackingCode: string): Promise<TrackingInfoDto>;
} 