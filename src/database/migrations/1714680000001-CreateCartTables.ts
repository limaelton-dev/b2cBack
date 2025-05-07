import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartTables1714680000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        profile_id INT NOT NULL,
        subtotal DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) DEFAULT 0,
        discount_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cart_profile FOREIGN KEY (profile_id)
          REFERENCES profile(id) ON DELETE CASCADE,
        CONSTRAINT fk_cart_discount FOREIGN KEY (discount_id)
          REFERENCES discount(id)
      );

      CREATE TABLE cart_item (
        id SERIAL PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id)
          REFERENCES cart(id) ON DELETE CASCADE,
        CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id)
          REFERENCES product(id) ON DELETE RESTRICT
      );

      CREATE INDEX idx_cart_profile_id ON cart(profile_id);
      CREATE INDEX idx_cart_item_cart_id ON cart_item(cart_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_cart_item_cart_id;
      DROP INDEX IF EXISTS idx_cart_profile_id;
      DROP TABLE IF EXISTS cart_item;
      DROP TABLE IF EXISTS cart;
    `);
  }
} 