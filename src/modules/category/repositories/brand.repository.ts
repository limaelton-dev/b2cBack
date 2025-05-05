import { Injectable } from "@nestjs/common";
import { Brand } from "../entities/brand.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { generateSlug } from "src/common/helpers/category.util";

@Injectable()
export class BrandRepository {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>
    ) {}

    async upsert(data: { oracleId: number, name: string }): Promise<Brand> {
        const slug = generateSlug(data.name);

        let brand = await this.brandRepository.findOne({
            where: { oracleId: data.oracleId }
        });

        if (brand) {
            brand.name = data.name;
            brand.slug = slug;
            return this.brandRepository.save(brand);
        }

        brand = this.brandRepository.create({
            oracleId: data.oracleId,
            name: data.name,
            slug: slug
        });

        return this.brandRepository.save(brand);
    }

    async getId(data: {
        oracleId: number;
    }): Promise<number | null> {
        const category = await this.brandRepository.findOne({
            select: ["id"],
            where: {
                oracleId: data.oracleId
            },
        });

        return category ? category.id : null;
    }
}