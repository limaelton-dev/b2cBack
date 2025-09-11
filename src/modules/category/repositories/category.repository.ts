import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
// import { generateCategorySlug  } from "src/common/helpers/category.util";
import { Brand } from "../entities/brand.entity";
import { generateSlugFromPath } from "src/common/helpers/category.util";

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    async upsert(data: {
        oracleId: number;
        name: string;
        level: number;
        parentId?: number;
        brandId: number;
        sourceTable: string;
        sourceColumn: string;
    }): Promise<Category> {
        const slug = generateSlugFromPath(data.name);

        const existing = await this.categoryRepository.findOne({
            where: {
                oracleId: data.oracleId,
                sourceTable: data.sourceTable,
                sourceColumn: data.sourceColumn,
            },
        });

        if (existing) {
            existing.name = data.name;
            existing.slug = slug;
            existing.level = data.level;
            existing.parent = data.parentId ? { id: data.parentId } as Category : null;
            existing.brand = { id: data.brandId } as Brand;

            return this.categoryRepository.save(existing);

        }

        const newCategory = this.categoryRepository.create({
            oracleId: data.oracleId,
            name: data.name,
            slug,
            level: data.level,
            sourceTable: data.sourceTable,
            sourceColumn: data.sourceColumn,
            parent: data.parentId ? { id: data.parentId } as Category : null,
            brand: { id: data.brandId } as Brand,
        });

        return this.categoryRepository.save(newCategory);
    }

    async getId(data: {
        oracleId: number;
        sourceTable: string;
        sourceColumn: string;
    }): Promise<number | null> {
        const category = await this.categoryRepository.findOne({
            select: ["id"],
            where: {
                oracleId: data.oracleId,
                sourceTable: data.sourceTable,
                sourceColumn: data.sourceColumn,
            },
        });

        return category ? category.id : null;
    }

}