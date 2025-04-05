export function generateSlug(text: string): string {
    const normalizedText = text
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase() // converte para minúsculas
        .trim() // remove espaços em branco nas pontas
        .replace(/[^a-z0-9]+/g, '-') // substitui por hífen
        .replace(/^-+|-+$/g, '');    // remove hífens nas pontas

    return normalizedText;
}

export function generateCategorySlug(
    name: string,
    level: number,
    oracleId: number
  ): string {
    return `${generateSlug(name)}-${level}-${oracleId}`;
  }

// Slug para a marca
export function generateBrandSlug(brandName: string): string {
    return generateSlug(brandName);
}
