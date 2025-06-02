import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ShippingProviderInterface } from '../../interfaces/shipping-provider.interface';
import { ShippingCalculationResponseDto } from '../../dtos/shipping-calculation-response.dto';
import { ShippingItemDto } from '../../dtos/shipping-item.dto';
import { TrackingInfoDto } from '../../dtos/tracking-info.dto';

/**
 * Provider simulado para cálculo de frete
 * Usado para testes e simulações rápidas
 */
@Injectable()
export class SimulationProviderService implements ShippingProviderInterface {
  private readonly logger = new Logger(SimulationProviderService.name);

  // Configurações do frete simulado
  private readonly PAC_MIN_PRICE = 19.90;
  private readonly SEDEX_MULTIPLIER = 1.5; // SEDEX 50% mais caro que PAC
  private readonly PAC_DELIVERY_DAYS = 7;
  private readonly SEDEX_DELIVERY_DAYS = 1;

  // Faixas de preço baseadas em peso (em gramas)
  private readonly WEIGHT_PRICE_RANGES = [
    { min: 0, max: 500, basePrice: 19.90 },      // Até 500g
    { min: 501, max: 1000, basePrice: 22.90 },   // 501g - 1kg
    { min: 1001, max: 2000, basePrice: 27.90 },  // 1kg - 2kg
    { min: 2001, max: 5000, basePrice: 35.90 },  // 2kg - 5kg
    { min: 5001, max: 10000, basePrice: 45.90 }, // 5kg - 10kg
    { min: 10001, max: 30000, basePrice: 65.90 } // 10kg - 30kg
  ];

  // Multiplicadores baseados em volume (cm³)
  private readonly VOLUME_MULTIPLIERS = [
    { min: 0, max: 5000, multiplier: 1.0 },      // Até 5000cm³
    { min: 5001, max: 15000, multiplier: 1.2 },  // 5001 - 15000cm³
    { min: 15001, max: 50000, multiplier: 1.5 }, // 15001 - 50000cm³
    { min: 50001, max: 100000, multiplier: 2.0 } // 50001 - 100000cm³
  ];

  /**
   * Retorna o identificador único do provedor
   */
  getProviderId(): string {
    return 'simulation';
  }

  /**
   * Retorna o nome do provedor
   */
  getProviderName(): string {
    return 'Simulação de Frete';
  }

  /**
   * Verifica se um CEP é válido (formato de 8 dígitos)
   */
  private isValidZipCode(zipCode: string): boolean {
    return /^\d{8}$/.test(zipCode);
  }

  /**
   * Normaliza dimensões e peso conforme regras mínimas
   */
  private normalizeItemDimensions(item: ShippingItemDto): ShippingItemDto {
    if (!item.dimensions) {
      this.logger.warn(`Produto ${item.productId} sem dimensões, usando padrões`);
      item.dimensions = {
        height: 2,  // 2 cm
        width: 11,  // 11 cm
        length: 16  // 16 cm
      };
    } else {
      // Garantir valores mínimos
      item.dimensions.height = Math.max(1, Number(item.dimensions.height));
      item.dimensions.width = Math.max(1, Number(item.dimensions.width));
      item.dimensions.length = Math.max(1, Number(item.dimensions.length));
    }

    // Garantir peso mínimo de 100g
    item.weight = Math.max(100, Number(item.weight));

    return item;
  }

  /**
   * Calcula o preço base baseado no peso
   */
  private getBasePriceByWeight(weight: number): number {
    const range = this.WEIGHT_PRICE_RANGES.find(
      r => weight >= r.min && weight <= r.max
    );
    return range ? range.basePrice : this.WEIGHT_PRICE_RANGES[this.WEIGHT_PRICE_RANGES.length - 1].basePrice;
  }

  /**
   * Calcula o multiplicador baseado no volume
   */
  private getVolumeMultiplier(volume: number): number {
    const range = this.VOLUME_MULTIPLIERS.find(
      r => volume >= r.min && volume <= r.max
    );
    return range ? range.multiplier : this.VOLUME_MULTIPLIERS[this.VOLUME_MULTIPLIERS.length - 1].multiplier;
  }

  /**
   * Agrupa itens para otimizar o frete (simular empacotamento)
   */
  private createOptimizedBatches(items: ShippingItemDto[]): ShippingItemDto[][] {
    const normalizedItems = items.map(item => this.normalizeItemDimensions({ ...item }));
    
    // Calcular peso e volume total de todos os itens
    const totalWeight = normalizedItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalVolume = normalizedItems.reduce((sum, item) => {
      const volume = item.dimensions.height * item.dimensions.width * item.dimensions.length;
      return sum + (volume * item.quantity);
    }, 0);
    
    // Limites para agrupamento (valores maiores para otimizar mais)
    const MAX_BATCH_WEIGHT = 10000; // 10kg
    const MAX_BATCH_VOLUME = 50000; // 50000cm³
    
    // Se todos os itens cabem em um único pacote, retornar tudo junto
    if (totalWeight <= MAX_BATCH_WEIGHT && totalVolume <= MAX_BATCH_VOLUME) {
      this.logger.log(`Todos os itens cabem em um único pacote: peso=${totalWeight}g, volume=${totalVolume}cm³`);
      return [normalizedItems];
    }
    
    // Caso contrário, usar a lógica de agrupamento
    const batches: ShippingItemDto[][] = [];
    let currentBatch: ShippingItemDto[] = [];
    let currentBatchWeight = 0;
    let currentBatchVolume = 0;

    for (const item of normalizedItems) {
      const itemWeight = item.weight * item.quantity;
      const itemVolume = item.dimensions.height * item.dimensions.width * item.dimensions.length * item.quantity;

      // Verificar se o item cabe no lote atual
      if (
        currentBatchWeight + itemWeight > MAX_BATCH_WEIGHT ||
        currentBatchVolume + itemVolume > MAX_BATCH_VOLUME
      ) {
        // Finalizar lote atual se não estiver vazio
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
        }
        
        // Iniciar novo lote
        currentBatch = [item];
        currentBatchWeight = itemWeight;
        currentBatchVolume = itemVolume;
      } else {
        // Adicionar ao lote atual
        currentBatch.push(item);
        currentBatchWeight += itemWeight;
        currentBatchVolume += itemVolume;
      }
    }

    // Adicionar último lote se não estiver vazio
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    this.logger.log(`Criados ${batches.length} lotes otimizados para ${items.length} produtos`);
    return batches;
  }

  /**
   * Calcula o frete de um lote
   */
  private calculateBatchPrice(batch: ShippingItemDto[], serviceMultiplier: number): number {
    // Calcular peso e volume total do lote
    const totalWeight = batch.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalVolume = batch.reduce((sum, item) => {
      const volume = item.dimensions.height * item.dimensions.width * item.dimensions.length;
      return sum + (volume * item.quantity);
    }, 0);

    // Obter preço base pelo peso total consolidado
    const basePrice = this.getBasePriceByWeight(totalWeight);
    
    // Aplicar multiplicador de volume
    const volumeMultiplier = this.getVolumeMultiplier(totalVolume);
    
    // Calcular preço final
    let finalPrice = basePrice * volumeMultiplier * serviceMultiplier;
    
    // Garantir preço mínimo para PAC
    if (serviceMultiplier === 1.0) { // É PAC
      finalPrice = Math.max(finalPrice, this.PAC_MIN_PRICE);
    }

    this.logger.log(`Lote: peso=${totalWeight}g, volume=${totalVolume}cm³, preçoBase=${basePrice}, volMult=${volumeMultiplier}, preçoFinal=${finalPrice}`);
    
    return Math.round(finalPrice * 100) / 100; // Arredondar para 2 casas decimais
  }

  /**
   * Implementação do cálculo de frete simulado
   */
  async calculateShipping(
    originZipCode: string,
    destinationZipCode: string,
    items: ShippingItemDto[]
  ): Promise<ShippingCalculationResponseDto> {
    try {
      this.logger.log(`[SIMULATION] Calculando frete simulado para ${items.length} produtos`);
      this.logger.log(`CEP origem: ${originZipCode}, CEP destino: ${destinationZipCode}`);
      
      // Validar CEPs
      if (!this.isValidZipCode(originZipCode) || !this.isValidZipCode(destinationZipCode)) {
        throw new BadRequestException('CEP de origem ou destino inválido. Deve conter 8 dígitos numéricos.');
      }

      // Verificar se há itens para cálculo
      if (!items || items.length === 0) {
        throw new BadRequestException('Nenhum item para cálculo de frete');
      }

      // Criar lotes otimizados
      const batches = this.createOptimizedBatches(items);
      
      // Definir os serviços
      const services = [
        { 
          code: '04669', 
          name: 'PAC', 
          multiplier: 1.0, 
          deliveryDays: this.PAC_DELIVERY_DAYS 
        },
        { 
          code: '04014', 
          name: 'SEDEX', 
          multiplier: this.SEDEX_MULTIPLIER, 
          deliveryDays: this.SEDEX_DELIVERY_DAYS 
        }
      ];

      const serviceResults = [];

      // Calcular para cada serviço
      for (const service of services) {
        let totalServicePrice = 0;
        let serviceItems = [];

        // Calcular preço para cada lote
        for (const batch of batches) {
          const batchPrice = this.calculateBatchPrice(batch, service.multiplier);
          totalServicePrice += batchPrice;

          // Distribuir preço proporcionalmente entre os itens do lote
          // Usar o peso como base para distribuição (mais justo que volume)
          const totalBatchWeight = batch.reduce((sum, item) => {
            return sum + (item.weight * item.quantity);
          }, 0);

          batch.forEach(item => {
            const itemWeight = item.weight * item.quantity;
            const weightRatio = totalBatchWeight > 0 ? itemWeight / totalBatchWeight : 1 / batch.length;
            const itemPrice = batchPrice * weightRatio;

            serviceItems.push({
              productId: item.productId,
              serviceCode: service.code,
              quantity: item.quantity,
              price: Math.round(itemPrice * 100) / 100,
              deliveryTime: service.deliveryDays
            });
          });
        }

        // Calcular data estimada de entrega
        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + service.deliveryDays);

        serviceResults.push({
          serviceCode: service.code,
          serviceName: service.name,
          price: Math.round(totalServicePrice * 100) / 100,
          deliveryTime: service.deliveryDays,
          estimatedDeliveryDate,
          items: serviceItems
        });

        this.logger.log(`[SIMULATION] ${service.name}: R$ ${totalServicePrice.toFixed(2)}, ${service.deliveryDays} dias`);
      }

      // Ordenar por preço (PAC primeiro, mais barato)
      serviceResults.sort((a, b) => a.price - b.price);

      // Usar o serviço mais barato como padrão
      const defaultService = serviceResults[0];

      const result = {
        success: true,
        message: 'Frete S calculado com sucesso',
        data: {
          items: defaultService.items,
          totalPrice: defaultService.price,
          maxDeliveryTime: defaultService.deliveryTime,
          estimatedDeliveryDate: defaultService.estimatedDeliveryDate,
          availableServices: serviceResults.map(service => ({
            serviceCode: service.serviceCode,
            serviceName: service.serviceName,
            price: service.price,
            deliveryTime: service.deliveryTime,
            isEstimated: false
          }))
        }
      };

      this.logger.log(`[SIMULATION RESULT] ${JSON.stringify(result)}`);
      return result;

    } catch (error) {
      this.logger.error(`[SIMULATION ERROR] Erro ao calcular frete simulado: ${error.message}`, error.stack);
      
      return {
        success: false,
        message: `Erro ao calcular frete: ${error.message}`,
      };
    }
  }

  /**
   * Implementação da consulta de rastreamento simulado
   */
  async getTrackingInfo(trackingCode: string): Promise<TrackingInfoDto> {
    try {
      this.logger.log(`[SIMULATION TRACKING] Consultando rastreamento simulado para: ${trackingCode}`);
      
      // Simular diferentes estados baseado no código
      const isDelivered = trackingCode.endsWith('1') || trackingCode.endsWith('2');
      const currentStatus = isDelivered ? 'Objeto entregue' : 'Objeto em trânsito';
      
      const now = new Date();
      const estimatedDeliveryDate = new Date(now.setDate(now.getDate() + 3));
      
      const events = [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
          description: 'Objeto postado',
          location: 'Agência dos Correios - Origem',
          statusCode: 'PO01'
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
          description: 'Objeto em trânsito',
          location: 'Centro de Distribuição',
          statusCode: 'DO01'
        }
      ];

      if (isDelivered) {
        events.push({
          date: new Date(),
          description: 'Objeto entregue ao destinatário',
          location: 'Local de entrega',
          statusCode: 'BDE01'
        });
      }

      return {
        success: true,
        message: 'Rastreamento simulado recuperado',
        trackingCode,
        data: {
          currentStatus,
          isDelivered,
          estimatedDeliveryDate: isDelivered ? new Date() : estimatedDeliveryDate,
          events
        }
      };
    } catch (error) {
      this.logger.error(`[SIMULATION TRACKING ERROR] Erro ao consultar rastreamento: ${error.message}`, error.stack);
      
      return {
        success: false,
        message: `Erro ao consultar rastreamento: ${error.message}`,
        trackingCode
      };
    }
  }
} 