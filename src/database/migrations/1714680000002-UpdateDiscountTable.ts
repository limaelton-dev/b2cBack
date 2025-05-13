import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDiscountTable1714680000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE discount
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS percentage DECIMAL(5, 2),
      ADD COLUMN IF NOT EXISTS fixed_amount DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS expiration_date DATE,
      ADD COLUMN IF NOT EXISTS usage_limit INT,
      ADD COLUMN IF NOT EXISTS usage_count INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE discount
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS percentage,
      DROP COLUMN IF EXISTS fixed_amount,
      DROP COLUMN IF EXISTS expiration_date,
      DROP COLUMN IF EXISTS usage_limit,
      DROP COLUMN IF EXISTS usage_count,
      DROP COLUMN IF EXISTS is_active;
    `);
  }
} 