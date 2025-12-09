/**
 * Arredonda valor monetário para 2 casas decimais.
 */
export function roundPrice(value: number | undefined | null): number {
    if (value == null || isNaN(value)) return 0;
    return Math.round(value * 100) / 100;
}

export function normalizeToSlug(text: string): string {
    return text
      .normalize("NFD")                  // remove acentos
      .replace(/[\u0300-\u036f]/g, "")   // remove marcas diacríticas
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")      // remove caracteres inválidos
      .replace(/\s+/g, "-")              // espaços -> hífen
      .replace(/-+/g, "-");              // hífens duplicados
  }

export function generateUniqueProductSlug(baseText: string, existingSlugs: Set<string>): string {
    const baseSlug = normalizeToSlug(baseText);    
    let counter = 1;

    let newSlug = `${baseSlug}-${counter}`;

    while(existingSlugs.has(newSlug)) {
        newSlug = `${normalizeToSlug(baseSlug)}-${counter++}`;
    }
    return newSlug;
}

/**
 * Adiciona slugs únicos a uma lista de produtos.
 */
export function addSlugsToProducts<T extends { title?: string }>(products: T[]): (T & { slug: string })[] {
    const existingSlugs = new Set<string>();

    return products.map((product) => {
        const uniqueSlug = generateUniqueProductSlug(product.title ?? '', existingSlugs);
        existingSlugs.add(uniqueSlug);
        return { ...product, slug: uniqueSlug };
    });
} 