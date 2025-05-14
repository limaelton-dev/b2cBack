/**
 * DTO para resposta de cálculo de frete
 */
export class ShippingCalculationResponseDto {
  /**
   * Indica se o cálculo foi bem-sucedido
   */
  success: boolean;
  
  /**
   * Mensagem de erro ou sucesso
   */
  message: string;
  
  /**
   * Dados do cálculo de frete
   */
  data?: {
    /**
     * Detalhes de frete para cada item
     */
    items: {
      /**
       * ID do produto
       */
      productId: number;
      
      /**
       * Código do serviço
       */
      serviceCode: string;
      
      /**
       * Quantidade
       */
      quantity: number;
      
      /**
       * Preço do frete
       */
      price: number;
      
      /**
       * Prazo de entrega em dias
       */
      deliveryTime: number;
    }[];
    
    /**
     * Preço total do frete
     */
    totalPrice: number;
    
    /**
     * Maior prazo de entrega entre todos os itens
     */
    maxDeliveryTime: number;
    
    /**
     * Data estimada de entrega
     */
    estimatedDeliveryDate: Date;
    
    /**
     * Opções de serviço disponíveis (SEDEX, PAC, etc)
     */
    availableServices?: {
      /**
       * Código do serviço
       */
      serviceCode: string;
      
      /**
       * Nome do serviço
       */
      serviceName: string;
      
      /**
       * Preço total
       */
      price: number;
      
      /**
       * Prazo de entrega em dias
       */
      deliveryTime: number;

      /**
       * Indica se o valor é estimado ou calculado diretamente pela API
       */
      isEstimated?: boolean;
    }[];
  };
} 