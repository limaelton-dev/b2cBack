import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AnyMarketConfigService } from './config/any-market.config.service';
import { 
  AnyMarketApiException, 
  AnyMarketAuthException, 
  AnyMarketRateLimitException 
} from './exceptions/any-market.exception';

@Injectable()
export class AnyMarketApiProvider {
  private readonly logger = new Logger(AnyMarketApiProvider.name);

  constructor(
    private readonly http: HttpService,
    private readonly AnyMarketConfig: AnyMarketConfigService,
  ) {}

  private handleError(error: any): never {
    this.logger.error('Erro na API do AnyMarket:', error);

    if (error.response?.status === 401) {
      throw new AnyMarketAuthException(error);
    }

    if (error.response?.status === 429) {
      throw new AnyMarketRateLimitException(error);
    }

    throw new AnyMarketApiException(
      error.response?.data?.message || error.message || 'Erro na API do AnyMarket',
      error.response?.status || 500,
      error,
    );
  }

  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const url = this.AnyMarketConfig.getFullUrl(endpoint);
      const headers = this.AnyMarketConfig.getHeaders();

      const { data } = await firstValueFrom(
        this.http.get<T>(url, { headers }).pipe(
          catchError((error) => {
            this.handleError(error);
          })
        )
      );

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T = any>(endpoint: string, body: any): Promise<T> {
    try {
      const url = this.AnyMarketConfig.getFullUrl(endpoint);
      const headers = this.AnyMarketConfig.getHeaders();

      const { data } = await firstValueFrom(
        this.http.post<T>(url, body, { headers }).pipe(
          catchError((error) => {
            this.handleError(error);
            throw error;
          })
        )
      );

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T = any>(endpoint: string, body: any): Promise<T> {
    try {
      const url = this.AnyMarketConfig.getFullUrl(endpoint);
      const headers = this.AnyMarketConfig.getHeaders();

      const { data } = await firstValueFrom(
        this.http.put<T>(url, body, { headers }).pipe(
          catchError((error) => {
            this.handleError(error);
            throw error;
          })
        )
      );

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const url = this.AnyMarketConfig.getFullUrl(endpoint);
      const headers = this.AnyMarketConfig.getHeaders();

      const { data } = await firstValueFrom(
        this.http.delete<T>(url, { headers }).pipe(
          catchError((error) => {
            this.handleError(error);
            throw error;
          })
        )
      );

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
