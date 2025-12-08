import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductsService } from "./products.service";

export interface ProductAvailability {
    id: number;
    skus: {id: number, quantity: number}[];
    quantity: number;
  }

@Injectable()
export class ProductsAvailabilityService {
    constructor(
        private readonly productsService: ProductsService
    ) { }

    async availableProduct(id: number, skuId: number) {
        const product = await this.productsService.findOne(id);
        const sku = product.skus.find(sku => sku.id === skuId);
        if (!sku) {
            throw new NotFoundException(`Produto com ID ${id} e SKU ${skuId} não encontrado`);
        }
        if (!sku.isAvailable) {
            throw new NotFoundException(`Produto com ID ${id} e SKU ${skuId} não está disponível`);
        }

        return product;
    }

    async availableQuantityProduct(id: number, skuId: number, quantity: number) {
        const product = await this.productsService.findOne(id);
        const sku = product.skus.find(sku => sku.id === skuId);
        if (!sku) {
            throw new NotFoundException(`Produto com ID ${id} e SKU ${skuId} não encontrado`);
        }

        if (sku.quantity < quantity) {
            throw new NotFoundException(`Produto com ID ${id} e SKU ${skuId} não tem disponibilidade para a quantidade ${quantity}`);
        }

        return sku.quantity - quantity;
    }
}