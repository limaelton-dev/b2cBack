import { Injectable } from '@nestjs/common';
import { AnyMarketApiProvider } from "../any-market-api.provider";
import { AnyMarketPagedResponse, getNextLink } from "./pagination.types";

@Injectable()
export class PaginationHelperService {
    constructor(private readonly api: AnyMarketApiProvider) {}

    /**
     * Itera páginas completas seguindo links.rel === 'next'.
     * start pode ser endpoint relativo ('/products?page=0&size=50') ou URL absoluta.
    */
    async *iteratePages<T = any>(start: string): AsyncGenerator<AnyMarketPagedResponse<T>, void, void> {
        let cursor: string | null = start;

        while(cursor) {
            const page = 
                cursor.startsWith('http') ?
                    await this.api.getByUrl<AnyMarketPagedResponse<T>>(cursor) :
                    await this.api.get<AnyMarketPagedResponse<T>>(cursor);
            
            yield page;

            const hasContent = Array.isArray(page.content) && page.content.length > 0;
            const hasItems = page.items && Array.isArray(page.items) && page.items.length > 0;
            const totalElements = page.page?.totalElements ?? page.totalElements ?? 0;

            if(!hasContent || totalElements === 0) break
            // LOG DA PÁGINA
            const next = getNextLink(page.links);
            cursor = next ?? null;
        }
    }

    /**
     * Itera diretamente os itens (response.content) de todas as páginas.
    */
    async *iterateItems<T = any>(start: string): AsyncGenerator<T, void, void> {
        for await (const page of this.iteratePages<T>(start)) {
            const items = Array.isArray(page.content) ? page.content : [];

            if (Array.isArray(items)) {
                for (const item of items) yield item;
            }
        }
    }

    /**
     * Conveniência: agrega todos os itens em memória (use com parcimônia).
     * É possível limitar por `maxItems` para evitar estouro.
    */
    async fetchAllItems<T = any>(start: string, maxItems?: number): Promise<T[]> {
        const out: T[] = [];
        for await (const item of this.iterateItems<T>(start)) {
            out.push(item);

            if(typeof maxItems === 'number' && out.length >= maxItems) break;
        }
        return out;
    }
}