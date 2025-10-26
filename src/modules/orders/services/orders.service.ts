import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { AnyMarketApiProvider } from '../../../shared/anymarket/any-market-api.provider';
import { 
  AnyMarketOrder, 
  AnyMarketOrdersResponse, 
  AnyMarketOrderFilter,
  OrderListResponse,
  OrderDetailResponse
} from '../dto/anymarket-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly anyMarketApi: AnyMarketApiProvider,
  ) {}

  // Novos métodos para integração com AnyMarket
  async getOrdersFromAnyMarket(filters: AnyMarketOrderFilter = {}): Promise<OrderListResponse> {
    try {
      this.logger.log('Buscando orders do AnyMarket', filters);
      
      const queryParams = new URLSearchParams();
      
      // Só adicionar parâmetros que tenham valores válidos
      if (filters.offset !== undefined && filters.offset !== null) {
        queryParams.append('offset', filters.offset.toString());
      }
      if (filters.limit !== undefined && filters.limit !== null) {
        queryParams.append('limit', filters.limit.toString());
      }
      if (filters.marketplaceId) queryParams.append('marketplaceId', filters.marketplaceId);
      if (filters.accountName) queryParams.append('accountName', filters.accountName);
      if (filters.orderId) queryParams.append('orderId', filters.orderId);
      if (filters.orderNumber) queryParams.append('orderNumber', filters.orderNumber);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
      if (filters.trackingNumber) queryParams.append('trackingNumber', filters.trackingNumber);
      if (filters.createdAfter) queryParams.append('createdAfter', filters.createdAfter);
      if (filters.createdBefore) queryParams.append('createdBefore', filters.createdBefore);
      if (filters.updatedAfter) queryParams.append('updatedAfter', filters.updatedAfter);
      if (filters.updatedBefore) queryParams.append('updatedBefore', filters.updatedBefore);

      // Endpoint deve começar com /
      const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      this.logger.log(`Chamando endpoint: ${endpoint}`);
      
      const response = await this.anyMarketApi.get<AnyMarketOrdersResponse>(endpoint);
      
      this.logger.log(`Encontrados ${response.content.length} orders do AnyMarket`);

      return {
        orders: response.content,
        pagination: {
          total: response.totalElements,
          page: response.number,
          limit: response.size,
          totalPages: response.totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Erro ao buscar orders do AnyMarket:', error);
      
      // Tratamento específico para erro 503
      if (error.response?.status === 503) {
        throw new BadRequestException('Serviço do AnyMarket temporariamente indisponível. Tente novamente em alguns minutos.');
      }
      
      throw new BadRequestException(`Erro ao buscar pedidos do AnyMarket: ${error.message}`);
    }
  }

  async getOrderByIdFromAnyMarket(orderId: string): Promise<OrderDetailResponse> {
    try {
      this.logger.log(`Buscando order ${orderId} do AnyMarket`);
      
      // Endpoint deve começar com /
      const endpoint = `/orders/${orderId}`;
      this.logger.log(`Chamando endpoint: ${endpoint}`);
      
      const order = await this.anyMarketApi.get<AnyMarketOrder>(endpoint);
      
      this.logger.log(`Order ${orderId} encontrado no AnyMarket`);
      
      return order;
    } catch (error) {
      this.logger.error(`Erro ao buscar order ${orderId} do AnyMarket:`, error);
      
      if (error.response?.status === 404) {
        throw new NotFoundException(`Pedido ${orderId} não encontrado no AnyMarket`);
      }
      
      if (error.response?.status === 503) {
        throw new BadRequestException('Serviço do AnyMarket temporariamente indisponível. Tente novamente em alguns minutos.');
      }
      
      throw new BadRequestException(`Erro ao buscar pedido do AnyMarket: ${error.message}`);
    }
  }
} 