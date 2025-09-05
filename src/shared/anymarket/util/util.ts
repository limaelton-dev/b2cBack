interface OffsetLimit {
    offset: number;
    limit: number;
}

interface normalizePaginationParams {
    page?: number,
    size?: number,
    rawOffset?: number,
    rawLimit?: number,
}

export function normalizePagination(params: normalizePaginationParams = {}): OffsetLimit {
    const { page, size, rawOffset, rawLimit } = params;
    
    if(typeof page === 'number' && typeof size === 'number') {
      const safePage = Math.max(page, 0);
      const safeSize = Math.min(Math.max(size, 1), 50);
      return {
        offset: safePage * safeSize,
        limit: safeSize
      }
    }
    
    return {
      offset: rawOffset ?? 0,
      limit: rawLimit ?? 50
    }
}