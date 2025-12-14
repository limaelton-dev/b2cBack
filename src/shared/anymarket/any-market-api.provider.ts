import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AnyMarketConfigService } from './config/any-market.config.service';
import { 
  AnyMarketApiException, 
  AnyMarketAuthException, 
  AnyMarketRateLimitException 
} from './exceptions/any-market.exception';

@Injectable()
export class AnyMarketApiProvider {
  private readonly logger = new Logger(AnyMarketApiProvider.name);
  private readonly debugMode: boolean;
  private readonly logsBaseDir: string;
  private requestCounter = 0;

  constructor(
    private readonly http: HttpService,
    private readonly AnyMarketConfig: AnyMarketConfigService,
    private readonly configService: ConfigService,
  ) {
    this.debugMode = this.configService.get('NODE_ENV') !== 'production';
    this.logsBaseDir = join(process.cwd(), 'logs', 'anymarket');
  }

  private logRequest(method: string, url: string, body?: any, response?: any, error?: any, duration?: number): void {
    if (!this.debugMode) return;
    
    const now = new Date();
    const dayFolder = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const dayPath = join(this.logsBaseDir, dayFolder);
    
    if (!existsSync(dayPath)) mkdirSync(dayPath, { recursive: true });
    
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const endpoint = url.split('/v2')[1]?.replace(/\//g, '_') || 'unknown';
    const status = error ? 'ERROR' : 'OK';
    const fileName = `${timestamp}_${method}_${endpoint}_${status}.json`;
    
    const entry = {
      timestamp: now.toISOString(),
      method,
      url,
      body,
      response,
      error: error ? { message: error.message, status: error.response?.status, data: error.response?.data } : undefined,
      duration,
    };
    
    try {
      writeFileSync(join(dayPath, fileName), JSON.stringify(entry, null, 2));
    } catch {}
  }

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
    const url = this.AnyMarketConfig.getFullUrl(endpoint);
    const startTime = Date.now();
    
    try {
      const headers = this.AnyMarketConfig.getHeaders();
      const { data } = await firstValueFrom(
        this.http.get<T>(url, { headers }).pipe(
          catchError((error) => {
            this.logRequest('GET', url, undefined, undefined, error, Date.now() - startTime);
            this.handleError(error);
          })
        )
      );
      
      this.logRequest('GET', url, undefined, data, undefined, Date.now() - startTime);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T = any>(endpoint: string, body: any): Promise<T> {
    const url = this.AnyMarketConfig.getFullUrl(endpoint);
    const startTime = Date.now();
    
    try {
      const headers = this.AnyMarketConfig.getHeaders();
      const { data } = await firstValueFrom(
        this.http.post<T>(url, body, { headers }).pipe(
          catchError((error) => {
            this.logRequest('POST', url, body, undefined, error, Date.now() - startTime);
            this.handleError(error);
            throw error;
          })
        )
      );

      this.logRequest('POST', url, body, data, undefined, Date.now() - startTime);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T = any>(endpoint: string, body: any): Promise<T> {
    const url = this.AnyMarketConfig.getFullUrl(endpoint);
    const startTime = Date.now();
    
    try {
      const headers = this.AnyMarketConfig.getHeaders();
      const { data } = await firstValueFrom(
        this.http.put<T>(url, body, { headers }).pipe(
          catchError((error) => {
            this.logRequest('PUT', url, body, undefined, error, Date.now() - startTime);
            this.handleError(error);
            throw error;
          })
        )
      );

      this.logRequest('PUT', url, body, data, undefined, Date.now() - startTime);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const url = this.AnyMarketConfig.getFullUrl(endpoint);
    const startTime = Date.now();
    
    try {
      const headers = this.AnyMarketConfig.getHeaders();
      const { data } = await firstValueFrom(
        this.http.delete<T>(url, { headers }).pipe(
          catchError((error) => {
            this.logRequest('DELETE', url, undefined, undefined, error, Date.now() - startTime);
            this.handleError(error);
            throw error;
          })
        )
      );

      this.logRequest('DELETE', url, undefined, data, undefined, Date.now() - startTime);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getByUrl<T = any>(url: string): Promise<T> {
    const startTime = Date.now();
    
    try {
      const headers = this.AnyMarketConfig.getHeaders();
      const { data } = await firstValueFrom(
        this.http.get<T>(url, { headers }).pipe(
          catchError((error) => {
            this.logRequest('GET', url, undefined, undefined, error, Date.now() - startTime);
            this.handleError(error);
          })
        )
      );

      this.logRequest('GET', url, undefined, data, undefined, Date.now() - startTime);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
