/**
 * DTO para retorno da validação do carrinho
 */
export class CartValidationResponseDto {
  /**
   * Valor subtotal (soma dos produtos)
   */
  subtotal: number;
  
  /**
   * Valor do frete
   */
  shipping: number;
  
  /**
   * Valor de descontos
   */
  discounts: number;
  
  /**
   * Valor total (subtotal + frete - descontos)
   */
  total: number;
  
  /**
   * Itens validados do carrinho
   */
  items: {
    /**
     * ID do produto
     */
    productId: number;
    
    /**
     * Nome do produto
     */
    productName: string;
    
    /**
     * Quantidade
     */
    quantity: number;
    
    /**
     * Preço unitário
     */
    unitPrice: number;
    
    /**
     * Preço total (preço unitário * quantidade)
     */
    totalPrice: number;
    
    /**
     * Código de serviço para frete
     */
    serviceCode?: string;
    
    /**
     * Peso em gramas
     */
    weight?: number;
    
    /**
     * Dimensões
     */
    dimensions?: {
      height: number;
      width: number;
      length: number;
    };
  }[];
  
  /**
   * Opções de envio disponíveis (SEDEX, PAC, etc)
   */
  shippingOptions?: {
    /**
     * Código do serviço
     */
    code: string;
    
    /**
     * Nome do serviço (ex: SEDEX, PAC)
     */
    name: string;
    
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
   * Indica se o carrinho é válido
   */
  isValid: boolean;
  
  /**
   * Lista de erros encontrados, se houver
   */
  errors?: string[];
} 