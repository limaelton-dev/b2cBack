export function generateSlug(text: string): string {
    const normalizedText = text
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase() // converte para minúsculas
        .trim() // remove espaços em branco nas pontas
        .replace(/[^a-z0-9]+/g, '-') // substitui por hífen
        .replace(/^-+|-+$/g, '');    // remove hífens nas pontas

    return normalizedText;
}

/**
 * Gera slug baseado no path da categoria do AnyMarket
 * Converte "Acessórios/Mouse Pad/Gamer" em "acessorios-mouse-pad-gamer"
 */
export function generateSlugFromPath(path: string): string {
    if (!path) return '';
    
    return generateSlug(path.replace(/\//g, '-'));
}
