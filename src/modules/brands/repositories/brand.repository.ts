import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BrandRepository {
    private readonly baseUrl = process.env.ANYMARKET_BASE_URL?.replace(/\/$/, '') || 'https://api.anymarket.com.br';
    private readonly apiPrefix = '/v2';

    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService
    ) {}

    private get headers(): Record<string, string> {
        return {
            "Content-Type": "application/json",
            gumgaToken: this.configService.get<string>("ANYMARKET_GUMGA_TOKEN")!,
            platform: this.configService.get<string>("ANYMARKET_PLATFORM")!,
        };
    }

    async fetchAll(): Promise<any> {
        try {
            const url = `${this.baseUrl}${this.apiPrefix}/brands?limit=31`;
            const { data } = await firstValueFrom(
                this.http.get(url, { headers: this.headers })
            );
            return data
        } catch(error) {
            console.error("Erro ao buscar marcas: ", error);
            throw error;
        }
    }
}