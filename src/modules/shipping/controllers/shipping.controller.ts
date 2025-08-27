import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { ShippingService } from '../services/shipping.service';
import { ShippingRequestDto } from '../dtos/shipping-request.dto';
import { ShippingCalculationResponseDto } from '../dtos/shipping-calculation-response.dto';
import { TrackingInfoDto } from '../dtos/tracking-info.dto';
import { ProductService } from '../../product-v1/services/product.service';

/**
 * Controller para gerenciamento de frete e rastreamento
 */
@Controller('shipping')
export class ShippingController {
  private readonly logger = new Logger(ShippingController.name);

  constructor(
    private readonly shippingService: ShippingService,
    private readonly productService: ProductService
  ) {}

  /**
   * Lista os provedores de frete disponíveis
   */
  @Get('providers')
  getAvailableProviders() {
    return this.shippingService.getAvailableProviders();
  }

  /**
   * Calcula o frete para um conjunto de itens
   */
  @Post('calculate')
  async calculateShipping(
    @Body(ValidationPipe) request: ShippingRequestDto
  ): Promise<ShippingCalculationResponseDto> {
    try {
      this.logger.log(`Calculando frete com provedor ${request.providerId}`);
      return await this.shippingService.calculateShipping(
        request.providerId,
        request.originZipCode,
        request.destinationZipCode,
        request.items
      );
    } catch (error) {
      this.logger.error(`Erro ao calcular frete: ${error.message}`, error.stack);
      throw new BadRequestException(
        error.message || 'Erro ao calcular frete'
      );
    }
  }

  /**
   * Consulta informações de rastreamento
   */
  @Get('track/:trackingCode')
  async getTrackingInfo(
    @Param('trackingCode') trackingCode: string,
    @Query('providerId') providerId?: string
  ): Promise<TrackingInfoDto> {
    try {
      return await this.shippingService.getTrackingInfo(
        providerId,
        trackingCode
      );
    } catch (error) {
      this.logger.error(`Erro ao consultar rastreamento: ${error.message}`, error.stack);
      throw new BadRequestException(
        error.message || 'Erro ao consultar rastreamento'
      );
    }
  }

  /**
   * Endpoint para cálculo simplificado de frete usando zip codes e produtos
   * Retorna opções de frete SEDEX e PAC para comparação
   */
  @Post('calculate-simple')
  async calculateSimpleShipping(
    @Body('originZipCode') originZipCode: string,
    @Body('destinationZipCode') destinationZipCode: string,
    @Body('products') products: { productId: number; quantity: number; weight: number; height: number; width: number; length: number }[],
    @Body('shippingType') shippingType: string = 'ALL'
  ): Promise<ShippingCalculationResponseDto> {
    try {
      if (!originZipCode || !destinationZipCode) {
        throw new BadRequestException('CEP de origem e destino são obrigatórios');
      }

      if (!products || products.length === 0) {
        throw new BadRequestException('Pelo menos um produto é obrigatório');
      }

      // Determinar código de serviço com base no tipo de frete
      // Por padrão, usamos SEDEX (04014), mas a implementação atual calculará ambos
      // A opção ALL fará o serviço calcular todas as opções disponíveis (SEDEX e PAC)
      const serviceCode = shippingType?.toUpperCase() === 'PAC' ? '04669' : '04014';

      // Mapear produtos para o formato esperado pelo serviço
      const items = products.map(product => ({
        productId: product.productId,
        serviceCode: serviceCode,
        quantity: product.quantity || 1,
        weight: product.weight,
        dimensions: {
          height: product.height,
          width: product.width,
          length: product.length
        }
      }));

      const result = await this.shippingService.calculateShipping(
        'correios', // Provedor padrão
        originZipCode,
        destinationZipCode,
        items
      );
      
      this.logger.log(`Cálculo de frete simplificado concluído com ${result.data?.availableServices?.length || 0} opções de serviço`);
      
      return result;
    } catch (error) {
      this.logger.error(`Erro ao calcular frete simples: ${error.message}`, error.stack);
      throw new BadRequestException(
        error.message || 'Erro ao calcular frete'
      );
    }
  }

  /**
   * Calcula frete utilizando apenas IDs dos produtos
   * As dimensões e pesos serão buscados automaticamente do banco de dados
   * Retorna opções de frete SEDEX e PAC para comparação
   */
  @Post('calculate-by-ids')
  async calculateShippingByProductIds(
    @Body('originZipCode') originZipCode: string,
    @Body('destinationZipCode') destinationZipCode: string,
    @Body('products') products: { productId: number; quantity: number }[],
    @Body('shippingType') shippingType: string = 'ALL'
  ): Promise<ShippingCalculationResponseDto> {
    try {
      if (!originZipCode || !destinationZipCode) {
        throw new BadRequestException('CEP de origem e destino são obrigatórios');
      }

      if (!products || products.length === 0) {
        throw new BadRequestException('Pelo menos um produto é obrigatório');
      }

      // Buscar os produtos no banco de dados
      const productIds = products.map(p => p.productId);
      const productEntities = await this.productService.findByIds(productIds);

      if (productEntities.length === 0) {
        throw new BadRequestException('Nenhum produto válido encontrado');
      }

      // Determinar código de serviço com base no tipo de frete
      // Por padrão, usamos SEDEX (04014), mas a implementação atual calculará ambos
      // A opção ALL fará o serviço calcular todas as opções disponíveis (SEDEX e PAC)
      const serviceCode = shippingType?.toUpperCase() === 'PAC' ? '04669' : '04014';

      // Mapear produtos com suas dimensões e peso do banco
      const shippingItems = products.map(requestProduct => {
        const productEntity = productEntities.find(p => p.id === requestProduct.productId);
        
        if (!productEntity) {
          throw new BadRequestException(`Produto com ID ${requestProduct.productId} não encontrado`);
        }

        return {
          productId: requestProduct.productId,
          serviceCode: serviceCode,
          quantity: requestProduct.quantity || 1,
          weight: productEntity.weight,
          dimensions: {
            height: productEntity.height,
            width: productEntity.width, 
            length: productEntity.length
          }
        };
      });

      const result = await this.shippingService.calculateShipping(
        'simulation',
        originZipCode,
        destinationZipCode,
        shippingItems
      );
      
      this.logger.log(`Cálculo de frete concluído com ${result.data?.availableServices?.length || 0} opções de serviço`);
      
      return result;
    } catch (error) {
      this.logger.error(`Erro ao calcular frete por IDs: ${error.message}`, error.stack);
      throw new BadRequestException(
        error.message || 'Erro ao calcular frete'
      );
    }
  }
} 