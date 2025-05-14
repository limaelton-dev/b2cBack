import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingItemDto } from './shipping-item.dto';

/**
 * DTO para solicitação de cálculo de frete
 */
export class ShippingRequestDto {
  /**
   * Identificador do provedor de frete (ex: correios, jadlog, etc)
   */
  @IsString()
  @IsNotEmpty()
  providerId: string;
  
  /**
   * CEP de origem
   */
  @IsString()
  @IsNotEmpty()
  originZipCode: string;
  
  /**
   * CEP de destino
   */
  @IsString()
  @IsNotEmpty()
  destinationZipCode: string;
  
  /**
   * Itens para cálculo de frete
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShippingItemDto)
  items: ShippingItemDto[];
  
  /**
   * Código de serviço específico (opcional)
   * Se não informado, retorna todas as opções disponíveis
   */
  @IsString()
  @IsOptional()
  serviceCode?: string;
} 