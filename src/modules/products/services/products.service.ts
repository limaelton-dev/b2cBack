import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { ProductsFiltersDto } from '../dto/products-filters.dto';
import { ProductsFilterService } from './products-filters.service';
import { normalizePagination } from '../../../shared/anymarket/util/util';
import { addSlugsToProducts, roundPrice } from '../../../common/helpers/products.util';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductsRepository,
    private readonly filterService: ProductsFilterService,
  ) {}

  /**
   * Lista produtos disponíveis com filtros e paginação.
   */
  async findAll(filters: ProductsFiltersDto) {
    const { offset, limit } = normalizePagination({ 
      page: filters.page, 
      size: filters.size, 
      rawOffset: filters.offset, 
      rawLimit: filters.limit,
    });

    const result = await this.filterService.paginate(
      this.repository.streamAvailable(),
      {
        term: filters.term,
        categories: filters.categories,
        brands: filters.brands,
      },
      offset,
      limit,
    );

    return {
      ...result,
      items: addSlugsToProducts(result.items),
    };
  }

  /**
   * Busca produto disponível por ID.
   */
  async findById(id: number) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado ou indisponível`);
    }
    return product;
  }

  /**
   * Busca produto disponível por slug.
   */
  async findBySlug(slug: string) {
    for await (const product of this.repository.streamAvailable()) {
      const [withSlug] = addSlugsToProducts([product]);
      if (withSlug.slug === slug) return withSlug;
    }
    throw new NotFoundException(`Produto '${slug}' não encontrado`);
  }

  /**
   * Busca detalhes dos SKUs para exibição no carrinho.
   */
  async findSkusForCart(skuIds: number[]): Promise<Map<number, any>> {
    if (!skuIds?.length) return new Map();

    const products = await this.repository.findBySkuIds(skuIds);
    const skuMap = new Map<number, any>();

    for (const product of products) {
      for (const sku of product.skus ?? []) {
        if (!skuIds.includes(sku.id)) continue;

        const price = sku.price ?? 0;

        skuMap.set(sku.id, {
          id: sku.id,
          productId: product.id,
          title: sku.title,
          price: roundPrice(price),
          _rawPrice: price,
          partnerId: sku.partnerId,
          ean: sku.ean,
          stock: sku.amount ?? sku.quantity ?? 0,
          variations: sku.variations?.map((v: any) => ({ description: v.description })) ?? [],
          product: {
            id: product.id,
            title: product.title,
            brand: product.brand ? { name: product.brand.name } : null,
            images: product.images?.map((img: any) => ({
              main: img.main,
              url: img.url,
              standardUrl: img.standardUrl,
              originalImage: img.originalImage,
              variation: img.variation,
            })) ?? [],
          },
        });
      }
    }

    return skuMap;
  }

  /**
   * Valida disponibilidade de SKUs para carrinho/pedido.
   */
  async validateSkuAvailability(
    items: Array<{ skuId: number; quantity: number }>,
  ): Promise<SkuValidationResult> {
    if (!items?.length) {
      return { valid: [], invalid: [], isValid: true };
    }

    const skuIds = items.map(i => i.skuId);
    const products = await this.repository.findBySkuIds(skuIds);
    
    const skuMap = new Map<number, { sku: any; product: any }>();
    for (const product of products) {
      for (const sku of product.skus ?? []) {
        if (skuIds.includes(sku.id)) {
          skuMap.set(sku.id, { sku, product });
        }
      }
    }

    const valid: ValidatedSkuItem[] = [];
    const invalid: InvalidSkuItem[] = [];

    for (const item of items) {
      const found = skuMap.get(item.skuId);

      if (!found) {
        invalid.push({
          skuId: item.skuId,
          requestedQuantity: item.quantity,
          reason: 'SKU_NOT_FOUND',
          message: `SKU ${item.skuId} não encontrado ou indisponível`,
        });
        continue;
      }

      const { sku, product } = found;
      const stock = sku.amount ?? sku.quantity ?? 0;

      if (stock < item.quantity) {
        invalid.push({
          skuId: item.skuId,
          requestedQuantity: item.quantity,
          availableStock: stock,
          reason: 'INSUFFICIENT_STOCK',
          message: `Estoque insuficiente. Disponível: ${stock}`,
        });
        continue;
      }

      valid.push({
        skuId: sku.id,
        requestedQuantity: item.quantity,
        availableStock: stock,
        price: sku.price,
        productTitle: product.title,
        skuTitle: sku.title,
      });
    }

    return { valid, invalid, isValid: invalid.length === 0 };
  }
}

// Types
export interface ValidatedSkuItem {
  skuId: number;
  requestedQuantity: number;
  availableStock: number;
  price: number;
  productTitle: string;
  skuTitle: string;
}

export interface InvalidSkuItem {
  skuId: number;
  requestedQuantity: number;
  availableStock?: number;
  reason: 'SKU_NOT_FOUND' | 'PRODUCT_INACTIVE' | 'INSUFFICIENT_STOCK';
  message: string;
}

export interface SkuValidationResult {
  valid: ValidatedSkuItem[];
  invalid: InvalidSkuItem[];
  isValid: boolean;
}
