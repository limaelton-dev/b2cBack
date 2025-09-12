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