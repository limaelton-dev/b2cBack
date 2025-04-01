import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConsolidatedMigration1714680000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE profile_type_enum AS ENUM ('PF', 'PJ');
        CREATE TYPE order_status_enum AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
        CREATE TYPE discount_unit_enum AS ENUM ('percentage', 'fixed', 'free_shipping');
        CREATE TYPE discount_scope_enum AS ENUM ('product', 'order', 'shipping');

        CREATE TABLE "user" (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE profile (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            profile_type profile_type_enum NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_profile_user FOREIGN KEY (user_id)
                REFERENCES "user"(id) ON DELETE CASCADE
        );

        CREATE TABLE profile_pf (
            profile_id INTEGER PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            cpf VARCHAR(14) UNIQUE NOT NULL,
            birth_date DATE NOT NULL,
            gender VARCHAR(20),
            CONSTRAINT fk_profile_pf_profile FOREIGN KEY (profile_id)
                REFERENCES profile(id) ON DELETE CASCADE
        );

        CREATE TABLE profile_pj (
            profile_id INTEGER PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            cnpj VARCHAR(18) UNIQUE NOT NULL,
            trading_name VARCHAR(255),
            state_registration VARCHAR(50),
            municipal_registration VARCHAR(50),
            CONSTRAINT fk_profile_pj_profile FOREIGN KEY (profile_id)
                REFERENCES profile(id) ON DELETE CASCADE
        );

        CREATE TABLE address (
            id SERIAL PRIMARY KEY,
            profile_id INTEGER NOT NULL,
            street VARCHAR(255) NOT NULL,
            number VARCHAR(20) NOT NULL,
            complement VARCHAR(255),
            neighborhood VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            state VARCHAR(50) NOT NULL,
            zip_code VARCHAR(10) NOT NULL,
            is_default BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_address_profile FOREIGN KEY (profile_id)
                REFERENCES profile(id) ON DELETE CASCADE
        );

        CREATE TABLE phone (
            id SERIAL PRIMARY KEY,
            profile_id INTEGER NOT NULL,
            ddd VARCHAR(3) NOT NULL,
            number VARCHAR(10) NOT NULL,
            is_default BOOLEAN DEFAULT false,
            verified BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_phone_profile FOREIGN KEY (profile_id)
                REFERENCES profile(id) ON DELETE CASCADE
        );

        CREATE TABLE card (
            id SERIAL PRIMARY KEY,
            profile_id INTEGER NOT NULL,
            card_number VARCHAR(19) NOT NULL,
            holder_name VARCHAR(255) NOT NULL,
            expiration_date VARCHAR(7) NOT NULL,
            is_default BOOLEAN DEFAULT false,
            brand VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_card_profile FOREIGN KEY (profile_id)
                REFERENCES profile(id) ON DELETE CASCADE
        );

        CREATE TABLE category (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) NOT NULL UNIQUE,
            parent_category_id INT REFERENCES category(id)
        );

        CREATE TABLE brand (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) NOT NULL UNIQUE,
        };

        CREATE TABLE product (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
            stock INTEGER NOT NULL CHECK (stock >= 0),
            sku VARCHAR(50) UNIQUE NOT NULL,
            weight DECIMAL(10, 2) NOT NULL CHECK (weight >= 0),
            height DECIMAL(10, 2) NOT NULL CHECK (height >= 0),
            width DECIMAL(10, 2) NOT NULL CHECK (width >= 0),
            length DECIMAL(10, 2) NOT NULL CHECK (length >= 0),
            CONSTRAINT fk_product_brand FOREIGN KEY (brand_id)
                REFERENCES brand(id) ON DELETE SET NULL,
            CONSTRAINT fk_product_category FOREIGN KEY (category_id)
                REFERENCES category(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE discount (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE,
            unit discount_unit_enum NOT NULL,
            value DECIMAL(10, 2),
            scope discount_scope_enum NOT NULL,
            combinable BOOLEAN DEFAULT false,
            min_quantity INTEGER,
            first_purchase_only BOOLEAN DEFAULT false,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP NOT NULL,
            minimum_order_value DECIMAL(10, 2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE discount_product (
            id SERIAL PRIMARY KEY,
            discount_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            CONSTRAINT fk_discount_product_discount FOREIGN KEY (discount_id)
                REFERENCES discount(id) ON DELETE CASCADE,
            CONSTRAINT fk_discount_product_product FOREIGN KEY (product_id)
                REFERENCES product(id) ON DELETE CASCADE
        );

        CREATE TABLE "order" (
            id SERIAL PRIMARY KEY,
            profile_id INTEGER NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
            status order_status_enum DEFAULT 'pending',
            full_address TEXT NOT NULL,
            discount_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_order_profile FOREIGN KEY (profile_id)
                REFERENCES profile(id) ON DELETE RESTRICT,
            CONSTRAINT fk_order_discount FOREIGN KEY (discount_id)
                REFERENCES discount(id)
        );

        CREATE TABLE order_item (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            discount DECIMAL(10, 2),
            coupon_id INTEGER,
            total_price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_order_item_order FOREIGN KEY (order_id)
                REFERENCES "order"(id) ON DELETE CASCADE,
            CONSTRAINT fk_order_item_product FOREIGN KEY (product_id)
                REFERENCES product(id) ON DELETE RESTRICT,
            CONSTRAINT fk_order_item_coupon FOREIGN KEY (coupon_id)
                REFERENCES discount(id)
        );

        CREATE TABLE payment_method (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );

        CREATE TABLE payment (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL,
            transaction_amount DECIMAL(10, 2) NOT NULL,
            payment_method_id INTEGER NOT NULL,
            token VARCHAR(255),
            installments INTEGER NOT NULL,
            external_reference VARCHAR(255),
            payer_email VARCHAR(255) NOT NULL,
            payer_identification_type VARCHAR(50) NOT NULL,
            payer_identification_number VARCHAR(50) NOT NULL,
            payer_first_name VARCHAR(255) NOT NULL,
            payer_last_name VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_payment_order FOREIGN KEY (order_id)
                REFERENCES "order"(id) ON DELETE RESTRICT,
            CONSTRAINT fk_payment_payment_method FOREIGN KEY (payment_method_id)
                REFERENCES payment_method(id) ON DELETE RESTRICT
        );

        -- Índices para melhorar performance
        CREATE INDEX idx_address_profile_id ON address(profile_id);
        CREATE INDEX idx_phone_profile_id ON phone(profile_id);
        CREATE INDEX idx_card_profile_id ON card(profile_id);
        CREATE INDEX idx_order_profile_id ON "order"(profile_id);
        CREATE INDEX idx_order_item_order_id ON order_item(order_id);
        CREATE INDEX idx_discount_product_discount_id ON discount_product(discount_id);
        CREATE INDEX idx_payment_order_id ON payment(order_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_payment_order_id;
      DROP INDEX IF EXISTS idx_discount_product_discount_id;
      DROP INDEX IF EXISTS idx_order_item_order_id;
      DROP INDEX IF EXISTS idx_order_profile_id;
      DROP INDEX IF EXISTS idx_card_profile_id;
      DROP INDEX IF EXISTS idx_phone_profile_id;
      DROP INDEX IF EXISTS idx_address_profile_id;

      DROP TABLE IF EXISTS payment;
      DROP TABLE IF EXISTS payment_method;
      DROP TABLE IF EXISTS order_item;
      DROP TABLE IF EXISTS "order";
      DROP TABLE IF EXISTS discount_product;
      DROP TABLE IF EXISTS discount;
      DROP TABLE IF EXISTS product;
      DROP TABLE IF EXISTS card;
      DROP TABLE IF EXISTS phone;
      DROP TABLE IF EXISTS address;
      DROP TABLE IF EXISTS profile_pj;
      DROP TABLE IF EXISTS profile_pf;
      DROP TABLE IF EXISTS profile;
      DROP TABLE IF EXISTS "user";

      DROP TYPE IF EXISTS discount_scope_enum;
      DROP TYPE IF EXISTS discount_unit_enum;
      DROP TYPE IF EXISTS order_status_enum;
      DROP TYPE IF EXISTS profile_type_enum;
    `);
  }
} 