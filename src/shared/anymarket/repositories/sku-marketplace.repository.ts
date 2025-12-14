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

      if (!listings?.length) return null;

      const marketplace = this.config.getMarketplaceName();
      const matching = listings.filter(
        (l) => l.marketplace === marketplace && isListingActive(l),
      );

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
