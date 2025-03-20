import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class FrontendOriginGuard implements CanActivate {
  private readonly allowedOrigins: string[];

  constructor(private readonly configService: ConfigService) {
    // Recuperar origens permitidas da configuração
    const origins = this.configService.get<string>('ALLOWED_ORIGINS');
    this.allowedOrigins = origins ? origins.split(',') : [];

    // Sempre adicionar localhost para desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      this.allowedOrigins.push('http://localhost:3000');
      this.allowedOrigins.push('http://localhost:4200');
    }
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const origin = request.headers.origin || request.headers.referer || '';

    // Permitir requisições do Postman (que geralmente não tem origem definida)
    if (!origin || origin === '' || origin.includes('postman')) {
      return true;
    }

    // Função auxiliar para verificar se a origem está na lista de permitidos
    const isOriginAllowed = () => {
      // Se não houver origens permitidas configuradas, permitir qualquer origem
      if (this.allowedOrigins.length === 0) {
        return true;
      }

      // Verificar se a origem está na lista de permitidos
      return this.allowedOrigins.some(allowedOrigin => {
        return origin.startsWith(allowedOrigin);
      });
    };

    // Se a origem não estiver na lista de permitidos, lançar exceção
    if (!isOriginAllowed()) {
      throw new UnauthorizedException('Acesso não autorizado. Origem não permitida.');
    }

    return true;
  }
} 