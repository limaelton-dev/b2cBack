/**
 * DTO que representa um item para cálculo de frete
 */
export class ShippingItemDto {
  /**
   * ID do produto
   */
  productId: number;
  
  /**
   * Código do produto para serviço de frete (ex: código do serviço dos correios)
   */
  serviceCode: string;
  
  /**
   * Quantidade de itens
   */
  quantity: number;
  
  /**
   * Peso do item em gramas
   */
  weight: number;
  
  /**
   * Dimensões do item (opcional)
   */
  dimensions?: {
    /**
     * Altura em centímetros
     */
    height: number;
    
    /**
     * Largura em centímetros
     */
    width: number;
    
    /**
     * Comprimento em centímetros
     */
    length: number;
  };
} 