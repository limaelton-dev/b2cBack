import { Injectable } from "@nestjs/common";
import { AnyMarketApiProvider } from "../../../shared/anymarket";

@Injectable()
export class CategoryAnymarketRepository {
  constructor(private readonly anyMarketApi: AnyMarketApiProvider) {}

  async findAll() {
    try {
      const data = await this.anyMarketApi.get("/categories/fullPath");
      return data;
    } catch (error) {
      console.error("Erro ao buscar menu de categorias:", error);
      throw error;
    }
  }

  async findRootCategories() {
    try {
      const data = await this.anyMarketApi.get("/categories");
      return data;
    } catch (error) {
      console.error("Erro ao buscar menu de categorias:", error);
      throw error;
    }
  }
}
