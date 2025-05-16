/**
 * DTO para resposta de rastreamento de envio
 */
export class TrackingInfoDto {
  /**
   * Indica se a consulta foi bem-sucedida
   */
  success: boolean;
  
  /**
   * Mensagem de erro ou sucesso
   */
  message: string;
  
  /**
   * Código de rastreamento
   */
  trackingCode: string;
  
  /**
   * Dados do rastreamento
   */
  data?: {
    /**
     * Status atual do rastreamento
     */
    currentStatus: string;
    
    /**
     * Indica se a entrega foi concluída
     */
    isDelivered: boolean;
    
    /**
     * Data estimada de entrega
     */
    estimatedDeliveryDate?: Date;
    
    /**
     * Histórico de eventos de rastreamento
     */
    events: {
      /**
       * Data e hora do evento
       */
      date: Date;
      
      /**
       * Descrição do evento
       */
      description: string;
      
      /**
       * Local do evento
       */
      location?: string;
      
      /**
       * Código do status
       */
      statusCode: string;
    }[];
  };
} 