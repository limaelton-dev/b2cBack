// src/modules/product/services/product-image.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from '../entities/product.image.entity';
import { Repository } from 'typeorm';
import { CreateProductImageDto } from '../dto/create-product.image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
  ) {}

  async saveMany(images: CreateProductImageDto[]) {
    const toSave = images.map(data => this.productImageRepo.create(data));
    return this.productImageRepo.save(toSave);
  }

  async upsertImages(productId: number, baseUrl: string) {
    const savedImages: ProductImage[] = [];

    for (let i = 1; i < 5; i++) {
      const url = `${baseUrl}${String(i).padStart(2, '0')}.jpg`;
      const isMain = i === 1;
      const exists = await this.checkUrlExists(url);
      if (exists) {
        const image = new ProductImage();
        image.productId = productId;
        image.url = url;
        image.isMain = isMain;
        savedImages.push(image);
      }
    }

    if (savedImages.length > 0) {
      await this.productImageRepo.delete({ productId });
      await this.productImageRepo.save(savedImages);
    }

    return savedImages;
  }

  private async checkUrlExists(url: string): Promise<boolean> {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.status === 200;
    } catch {
      return false;
    }
  }
}
