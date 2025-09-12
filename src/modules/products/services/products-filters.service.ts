import { Injectable } from "@nestjs/common";

export interface ProductBrand {
    id?: string | number;
    name?: string;
}

export interface ProductCategory {
    id?: string | number;
    name?: string;
    path?: string;
}

export interface ProductCharacteristic {
    name?: string;
    value?: string | number | boolean;
}

export interface ProductSku {
    id?: string | number;
    title?: string;
    partnerId?: string | number; //"sku"
    ean?: string;
  }
  
export interface Product {
    id?: string | number;
    title?: string;
    description?: string;
    model?: string;
    brand?: ProductBrand;
    category?: ProductCategory;
    characteristics?: ProductCharacteristic[];
    skus?: ProductSku[];
    isProductActive?: boolean;
    // ...campos extras não impactam os filtros
}

export interface ProductsFiltersInput {
    term?: string;
    categories?: Array<string | number>;
    brands?: Array<string | number>;
}

export interface PaginatedSlice<T> {
    items: T[];
    offset: number;
    limit: number;
    totalMatched?: number;
    currentPage?: number;
    lastPage?: number;
}

@Injectable()
export class ProductsFilterService {
    /**
     * Calcula a página atual baseada no offset e limit (baseado em 1)
     */
    private calculateCurrentPage(offset: number, limit: number): number {
        if (limit <= 0) return 1;
        return Math.floor(offset / limit) + 1;
    }

    /**
     * Calcula o total de páginas baseado no total de itens e limit
     */
    private calculateTotalPages(totalItems: number, limit: number): number {
        if (limit <= 0 || totalItems <= 0) return 0;
        return Math.ceil(totalItems / limit);
    }

    /**
     * Normaliza texto para busca "humana": minúsculo + sem acentos.
    */
    private normalizeText(input?: unknown): string {
        if(input === undefined || input === null) return '';
        return String(input)
            .trim().toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
    }

    /**
     * Retorna uma função que testa se o produto atende aos filtros.
     * - term: busca em title, description, model, skus.partnerId/title, characteristics.value
     * - categoryIds: compara com category.id
     * - brandIds: compara com brand.id
    */
    buildPredicate(filters: ProductsFiltersInput): (p: Product) => boolean {
        const term = this.normalizeText(filters.term);
        const hasTerm = term.length > 0;

        const categorySet = new Set((filters.categories ?? []).map(String));
        const hasCategory = categorySet.size > 0;

        const brandSet = new Set((filters.brands ?? []).map(String));
        const hasBrand = brandSet.size > 0;

        return (p: Product) => {
            // FILTRO OBRIGATÓRIO: isProductActive deve ser true
            const isActiveProduct = p.isProductActive === true;
            if (!isActiveProduct) {
                return false;
            }

            const okTerm = !hasTerm
                ? true
                : (() => {
                    const haystack: string[] = [];
                    haystack.push(this.normalizeText(p.title));
                    haystack.push(this.normalizeText(p.description));
                    haystack.push(this.normalizeText(p.model));

                    if (Array.isArray(p.skus)) {
                        for (const s of p.skus) {
                            haystack.push(this.normalizeText(s.title));
                            haystack.push(this.normalizeText(s.partnerId));
                            haystack.push(this.normalizeText(s.ean));
                        }
                    }

                    if (Array.isArray(p.characteristics)) {
                        for (const c of p.characteristics) {
                          haystack.push(this.normalizeText(c.name));
                          haystack.push(this.normalizeText(c.value));
                        }
                    }

                    return haystack.some((word) => word.includes(term));
                })();

            const okCategory = !hasCategory
                ? true
                : categorySet.has(String(p.category?.id));

            const okBrand = !hasBrand
                ? true
                : brandSet.has(String(p.brand?.id));

            return okTerm && okCategory && okBrand;
        };
    }

    filterArray(products: Product[], filters: ProductsFiltersInput): Product[] {
        const predicate = this.buildPredicate(filters);
        return products.filter(predicate);
    }

    /**
     * Aplica os filtros em um stream (AsyncIterable), útil quando você
     * irá percorrer várias páginas da AnyMarket e quer "repor" até preencher a página após filtrar.
    */
    async *filterStream(
        stream: AsyncIterable<Product>,
        filters: ProductsFiltersInput,
    ): AsyncIterableIterator<Product> {
        const predicate = this.buildPredicate(filters);
        for await (const item of stream) {
            if (predicate(item)) yield item;
        }
    }

    /**
     * Dado um stream de produtos (por ex., vindo do seu PaginationHelper que segue links.next),
     * aplica os filtros e devolve APENAS o "slice" filtrado correspondente a offset/limit
     * do resultado FINAL (já filtrado).
     *
     * Isso resolve o problema clássico: AnyMarket só pagina por offset/limit,
     * Precisamos paginar o RESULTADO filtrado do servidor.
    */
    async takeSliceFromStream(
            stream: AsyncIterable<Product>,
            filters: ProductsFiltersInput,
            desiredOffset: number,
            desiredLimit: number,
            computeTotalMatched: boolean = false, // se true, varre tudo para retornar totalMatched
    ): Promise<PaginatedSlice<Product>> {
        const predicate = this.buildPredicate(filters);

        const result: Product[] = [];
        let matchedCount = 0;

        for await (const item of stream) {
            if (!predicate(item)) continue;
            if (matchedCount >= desiredOffset && result.length < desiredLimit) {
                result.push(item);
            }
            matchedCount++;

            if(!computeTotalMatched && result.length >= desiredLimit) break;
        }

        const currentPage = this.calculateCurrentPage(desiredOffset, desiredLimit);
        const lastPage = computeTotalMatched && matchedCount > 0 
            ? this.calculateTotalPages(matchedCount, desiredLimit)
            : undefined;

        return {
            items: result,
            offset: desiredOffset,
            limit: desiredLimit,
            totalMatched: computeTotalMatched ? matchedCount : undefined,
            currentPage,
            lastPage,
        };
    }
}