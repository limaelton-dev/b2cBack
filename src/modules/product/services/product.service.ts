import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/modules/category/entities/brand.entity';

@Injectable()
export class ProductService {
  constructor(
  ) {}

  async create(createProductDto: CreateProductDto) {
  }

  async findAll(paginationDto: PaginationDto) {
  }

  async find(ids: string | number) {
  }

  async findOne(id: number){
  }

  async findByIds(ids: number[]) {
  }

  async search(query: string) {
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
  }

  async getProdutosFabricanteLimit(limit: number) {
  }

  async remove(id: number): Promise<void> {

  }
} 