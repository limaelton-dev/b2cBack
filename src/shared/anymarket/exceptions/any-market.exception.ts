import { HttpException, HttpStatus } from '@nestjs/common';

export class AnyMarketApiException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_GATEWAY,
    public readonly originalError?: any,
  ) {
    super(
      {
        message,
        error: 'AnyMarket API Error',
        statusCode: status,
        originalError: originalError?.message,
      },
      status,
    );
  }
}

export class AnyMarketAuthException extends AnyMarketApiException {
  constructor(originalError?: any) {
    super(
      'Erro de autenticação com a API do AnyMarket',
      HttpStatus.UNAUTHORIZED,
      originalError,
    );
  }
}

export class AnyMarketRateLimitException extends AnyMarketApiException {
  constructor(originalError?: any) {
    super(
      'Limite de requisições excedido na API do AnyMarket',
      HttpStatus.TOO_MANY_REQUESTS,
      originalError,
    );
  }
}
