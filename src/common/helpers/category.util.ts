export function generateSlug(text: string): string {
    const normalizedText = text
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase() // converte para minúsculas
        .trim() // remove espaços em branco nas pontas
        .replace(/[^a-z0-9]+/g, '-') // substitui por hífen
        .replace(/^-+|-+$/g, '');    // remove hífens nas pontas
        
    return normalizedText;
}
export function generateCategorySlug(categoryName: string, brandName: string): string { 
    // Generate a slug for the category name and brand name
    const categorySlug = generateSlug(categoryName);
    const brandSlug = generateSlug(brandName);

    // Combine the slugs to create a unique slug for the category
    return `${categorySlug}-${brandSlug}`;
}
export function generateBrandSlug(brandName: string): string {
    return generateSlug(brandName);
}
