import { Injectable } from "@nestjs/common";
import { generateUniqueProductSlug } from "src/common/helpers/product.util";

export interface Product {
    title?: string;
    slug?: string;
}

@Injectable()
export class ProductSlugService {
    constructor(  
    ) {}

    addSlugsToProducts(products: Product[]): Product[] {
        const existingSlugs = new Set<string>();
    
        return products.map((product) => {
            const baseTextToSlug = product.title ?? '';
            const uniqueSlug = generateUniqueProductSlug(baseTextToSlug, existingSlugs);
            
            existingSlugs.add(uniqueSlug);
            return { ...product, slug: uniqueSlug };
        });
    }
}