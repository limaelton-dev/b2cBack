export function normalizeFabCodigo(originalFabCodigo: number): number {
    if ([290, 423].includes(originalFabCodigo)) return 197; // HP
    if ([344].includes(originalFabCodigo)) return 136; // PLUSCABLE
    if ([230, 419].includes(originalFabCodigo)) return 36; // C3TECH
    return originalFabCodigo;
}