import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductImageService } from './product.image.service';
import { ProductImage } from '../entities/product.image.entity';
import { PaginationDto } from '../dto/pagination.dto';

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

  async findAll(paginationDto: PaginationDto) {
    return this.productRepository.findAll(paginationDto);
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
    const pageSize = 50; // Processa 50 produtos por vez
    let currentPage = 1;
    let hasMoreProducts = true;
    let totalProcessed = 0;

    while (hasMoreProducts) {
      const paginationDto = new PaginationDto();
      paginationDto.page = currentPage;
      paginationDto.limit = pageSize;

      const result = await this.productRepository.findAll(paginationDto);
      const products = result.data;

      if (products.length === 0) {
        hasMoreProducts = false;
        continue;
      }

      for (const product of products) {
        const brand = product.brandImage?.replace(/\s/g, '').trim() || '';
        const model = product.modelImage?.replace(/\s/g, '').trim() || '';
        const baseUrl = `http://www.portalcoletek.com.br/imagens/200-200/${brand}_${model}_`;

        try {
          await this.productImageService.upsertImages(product.id, baseUrl);
          totalProcessed++;
          console.log(`Processado produto ID ${product.id} (${totalProcessed} de ${result.meta.total})`);
        } catch (error) {
          console.error(`Erro ao inserir imagens para produto ID ${product.id}:`, error);
        }
      }

      if (currentPage >= result.meta.totalPages) {
        hasMoreProducts = false;
      } else {
        currentPage++;
      }
    }

    console.log(`Processamento concluído. Total de produtos processados: ${totalProcessed}`);
    return true;
  }
} 