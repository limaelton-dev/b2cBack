export interface AnyMarketLink {
    rel: string;
    href: string;
  }

export interface AnyMarketPage {
  size?: number;
  totalElements?: number;
  totalPages?: number;
  number?: number;
}
  
export interface AnyMarketPagedResponse<T> {
  links?: AnyMarketLink[];
  content?: T[];
  items?: T[];
  products?: T[];
  page?: AnyMarketPage;
  totalElements?: number;
  [key: string]: unknown;
}
  
export function getNextLink(links?: AnyMarketLink[]): string | null {
  if (!Array.isArray(links)) return null;
  const next = links.find(l => l.rel?.toLowerCase() === 'next');
  return next?.href ?? null;
}
