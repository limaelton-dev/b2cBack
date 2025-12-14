import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { WebhookService } from '../services/webhook.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('mercadopago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notificação do Mercado Pago' })
  @ApiExcludeEndpoint()
  async handleMercadoPago(@Body() payload: any): Promise<{ received: boolean }> {
    this.logger.log(`Webhook MP recebido: action=${payload?.action}, type=${payload?.type}`);

    try {
      await this.webhookService.handleMercadoPagoWebhook(payload);
    } catch (error) {
      this.logger.error(`Erro ao processar webhook MP: ${error.message}`);
    }

    return { received: true };
  }
}
