import { Injectable } from "@nestjs/common";
import { AnyMarketApiProvider } from "src/shared/anymarket";

@Injectable()
export class BrandsRepository {
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