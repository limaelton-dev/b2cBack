import { Injectable, Logger } from '@nestjs/common';
import { AnyMarketApiProvider } from '../any-market-api.provider';
import { AnyMarketConfigService } from '../config/any-market.config.service';
import {
  SkuMarketplaceListing,
  SkuMarketplaceData,
  toSkuMarketplaceData,
  isListingActive,
} from '../interfaces/sku-marketplace.interface';

const CONCURRENCY_LIMIT = 5;

@Injectable()
export class SkuMarketplaceRepository {
  private readonly logger = new Logger(SkuMarketplaceRepository.name);

  constructor(
    private readonly api: AnyMarketApiProvider,
    private readonly config: AnyMarketConfigService,
  ) {}

  async findBySkuId(skuId: number): Promise<SkuMarketplaceData | null> {
    try {
      const listings = await this.api.get<SkuMarketplaceListing[]>(
        `/skus/${skuId}/marketplaces`,
      );

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/dbd08ada-682b-46fd-85fa-ae2fab5ba5bf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sku-marketplace.repository.ts:findBySkuId',message:'listings received',data:{skuId,listingsCount:listings?.length,firstListing:listings?.[0]?{marketPlace:listings[0].marketPlace,publicationStatus:listings[0].publicationStatus,amount:listings[0].amount}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1,H2,H3'})}).catch(()=>{});
      // #endregion

      if (!listings?.length) return null;

      const marketplace = this.config.getMarketplaceName();

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/dbd08ada-682b-46fd-85fa-ae2fab5ba5bf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sku-marketplace.repository.ts:findBySkuId',message:'marketplace config',data:{skuId,configuredMarketplace:marketplace,availableMarketplaces:listings.map(l=>l.marketPlace)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion

      const matching = listings.filter(
        (l) => l.marketPlace === marketplace && isListingActive(l),
      );

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/dbd08ada-682b-46fd-85fa-ae2fab5ba5bf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sku-marketplace.repository.ts:findBySkuId',message:'filter result',data:{skuId,matchingCount:matching.length,isActiveResults:listings.map(l=>({marketPlace:l.marketPlace,isActive:isListingActive(l),publicationStatus:l.publicationStatus}))},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1,H2'})}).catch(()=>{});
      // #endregion

      if (matching.length === 0) return null;

      if (matching.length > 1) {
        this.logger.warn(
          `SKU ${skuId} possui ${matching.length} anúncios ativos no marketplace ${marketplace}. Usando o primeiro.`,
        );
      }

      return toSkuMarketplaceData(matching[0], skuId);
    } catch {
      return null;
    }
  }

  async findBySkuIds(skuIds: number[]): Promise<Map<number, SkuMarketplaceData>> {
    const result = new Map<number, SkuMarketplaceData>();
    if (!skuIds?.length) return result;

    const uniqueIds = [...new Set(skuIds)];
    const batches = this.chunkArray(uniqueIds, CONCURRENCY_LIMIT);

    for (const batch of batches) {
      const promises = batch.map(async (skuId) => {
        const data = await this.findBySkuId(skuId);
        if (data) {
          result.set(skuId, data);
        }
      });

      await Promise.all(promises);
    }

    return result;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
