import { Injectable } from "@nestjs/common";

export interface ProductFilters {
    term?: string;
    categories?: Array<string | number>;
    brands?: Array<string | number>;
}

export interface PaginatedResult<T> {
    items: T[];
    offset: number;
    limit: number;
    total: number;
    page: number;
    lastPage: number;
}

@Injectable()
export class ProductsFilterService {
    
    /**
     * Normaliza texto para busca (lowercase + sem acentos).
     */
    private normalize(input?: unknown): string {
        if (input == null) return '';
        return String(input)
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
    }

    /**
     * Verifica se produto atende aos filtros.
     */
    private matches(product: any, filters: ProductFilters): boolean {
        // Filtro por termo (busca em múltiplos campos)
        if (filters.term) {
            const term = this.normalize(filters.term);
            const searchFields = [
                product.title,
                product.description,
                product.model,
                ...(product.skus?.flatMap((s: any) => [s.title, s.partnerId, s.ean]) ?? []),
                ...(product.characteristics?.flatMap((c: any) => [c.name, c.value]) ?? []),
            ];
            
            const found = searchFields.some(field => 
                this.normalize(field).includes(term)
            );
            if (!found) return false;
        }

        // Filtro por categoria
        if (filters.categories?.length) {
            const categorySet = new Set(filters.categories.map(String));
            if (!categorySet.has(String(product.category?.id))) return false;
        }

        // Filtro por marca
        if (filters.brands?.length) {
            const brandSet = new Set(filters.brands.map(String));
            if (!brandSet.has(String(product.brand?.id))) return false;
        }

        return true;
    }

    /**
     * Filtra e pagina produtos de um stream.
     * O stream já deve conter apenas produtos disponíveis.
     */
    async paginate<T>(
        stream: AsyncIterable<T>,
        filters: ProductFilters,
        offset: number,
        limit: number,
    ): Promise<PaginatedResult<T>> {
        const items: T[] = [];
        let total = 0;

        for await (const product of stream) {
            if (!this.matches(product, filters)) continue;
            
            // Coleta item se estiver dentro da "janela" de paginação
            if (total >= offset && items.length < limit) {
                items.push(product);
            }
            total++;
        }

        const page = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
        const lastPage = total > 0 && limit > 0 ? Math.ceil(total / limit) : 0;

        return { items, offset, limit, total, page, lastPage };
    }
}
