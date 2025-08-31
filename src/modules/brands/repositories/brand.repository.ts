import { Injectable } from "@nestjs/common";
import { AnyMarketApiProvider } from "src/shared/anymarket";

@Injectable()
export class BrandRepository {
    private readonly baseUrl = process.env.ANYMARKET_BASE_URL?.replace(/\/$/, '') || 'https://api.anymarket.com.br';
    private readonly apiPrefix = '/v2';

    constructor( private readonly anyMarketApi: AnyMarketApiProvider ) {}

    async findAll(): Promise<any> {
        try {
            const endpoint = `/brands?limit=31`;
            const  data  = await this.anyMarketApi.get(endpoint)
            return data
        } catch(error) {
            console.error("Erro ao buscar marcas: ", error);
            throw error;
        }
    }
}