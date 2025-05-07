import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductImageService } from './product.image.service';
import { ProductImage } from '../entities/product.image.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productImageService: ProductImageService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productData = this.mapDtoToEntity(createProductDto);
    return this.productRepository.create(productData);
  }

  private mapDtoToEntity(dto: CreateProductDto): Partial<Product> {
    const result: any = { ...dto };
    
    if (dto.brand) {
      result.brand = { id: dto.brand.id };
    }
    
    if (dto.categoryLevel1) {
      result.categoryLevel1 = { id: dto.categoryLevel1.id };
    }
    
    if (dto.categoryLevel2) {
      result.categoryLevel2 = { id: dto.categoryLevel2.id };
    }
    
    if (dto.categoryLevel3) {
      result.categoryLevel3 = { id: dto.categoryLevel3.id };
    }
    
    return result;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return this.productRepository.findByIds(ids);
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepository.search(query);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    await this.productRepository.remove(id);
  }

  async generateImagesForAllProducts(): Promise<boolean> {
    const allProducts = await this.productRepository.findAll();
    
    for (const product of allProducts) {
      const brand = product.brandImage?.replace(/\s/g, '').trim() || '';
      const model = product.modelImage?.replace(/\s/g, '').trim() || '';
      const baseUrl = `http://www.portalcoletek.com.br/imagens/200-200/${brand}_${model}_`;

      try {
        await this.productImageService.upsertImages(product.id, baseUrl);
      } catch (error) {
        console.error(`Erro ao inserir imagens para produto ID ${product.id}:`, error);
      }

    }
    return true;
  }
} 