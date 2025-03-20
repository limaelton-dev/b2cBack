import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1710974400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE profile_type_enum AS ENUM ('PF', 'PJ');
      CREATE TYPE order_status_enum AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
      CREATE TYPE discount_unit_enum AS ENUM ('percentage', 'fixed', 'free_shipping');
      CREATE TYPE discount_scope_enum AS ENUM ('product', 'order', 'shipping');

      -- Tabela de usuários
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabela de perfis
      CREATE TABLE profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          profile_type profile_type_enum NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_profiles_user FOREIGN KEY (user_id)
              REFERENCES users(id) ON DELETE CASCADE
      );

      -- Tabela de perfis de pessoa física
      CREATE TABLE profile_pf (
          profile_id INTEGER PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          cpf VARCHAR(14) UNIQUE NOT NULL,
          birth_date DATE NOT NULL,
          gender VARCHAR(20),
          CONSTRAINT fk_profile_pf_profile FOREIGN KEY (profile_id)
              REFERENCES profiles(id) ON DELETE CASCADE
      );

      -- Tabela de perfis de pessoa jurídica
      CREATE TABLE profile_pj (
          profile_id INTEGER PRIMARY KEY,
          company_name VARCHAR(255) NOT NULL,
          cnpj VARCHAR(18) UNIQUE NOT NULL,
          trading_name VARCHAR(255),
          state_registration VARCHAR(50),
          municipal_registration VARCHAR(50),
          CONSTRAINT fk_profile_pj_profile FOREIGN KEY (profile_id)
              REFERENCES profiles(id) ON DELETE CASCADE
      );

      -- Tabela de endereços
      CREATE TABLE addresses (
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
          CONSTRAINT fk_addresses_profile FOREIGN KEY (profile_id)
              REFERENCES profiles(id) ON DELETE CASCADE
      );

      -- Tabela de telefones
      CREATE TABLE phones (
          id SERIAL PRIMARY KEY,
          profile_id INTEGER NOT NULL,
          ddd VARCHAR(3) NOT NULL,
          number VARCHAR(10) NOT NULL,
          is_default BOOLEAN DEFAULT false,
          verified BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_phones_profile FOREIGN KEY (profile_id)
              REFERENCES profiles(id) ON DELETE CASCADE
      );

      -- Tabela de cartões
      CREATE TABLE cards (
          id SERIAL PRIMARY KEY,
          profile_id INTEGER NOT NULL,
          card_number VARCHAR(19) NOT NULL,
          holder_name VARCHAR(255) NOT NULL,
          expiration_date VARCHAR(7) NOT NULL,
          is_default BOOLEAN DEFAULT false,
          brand VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_cards_profile FOREIGN KEY (profile_id)
              REFERENCES profiles(id) ON DELETE CASCADE
      );

      -- Tabela de produtos
      CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabela de descontos
      CREATE TABLE discounts (
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

      -- Tabela de descontos por produto com referência explícita à tabela products
      CREATE TABLE discount_products (
          id SERIAL PRIMARY KEY,
          discount_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          CONSTRAINT fk_discount_products_discount FOREIGN KEY (discount_id)
              REFERENCES discounts(id) ON DELETE CASCADE,
          CONSTRAINT fk_discount_products_product FOREIGN KEY (product_id)
              REFERENCES products(id) ON DELETE CASCADE
      );

      -- Tabela de pedidos
      CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          profile_id INTEGER NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
          status order_status_enum DEFAULT 'pending',
          full_address TEXT NOT NULL,
          discount_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_orders_profile FOREIGN KEY (profile_id)
              REFERENCES profiles(id) ON DELETE RESTRICT,
          CONSTRAINT fk_orders_discount FOREIGN KEY (discount_id)
              REFERENCES discounts(id)
      );

      -- Tabela de itens de pedido
      CREATE TABLE order_items (
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
          CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
              REFERENCES orders(id) ON DELETE CASCADE,
          CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
              REFERENCES products(id) ON DELETE RESTRICT,
          CONSTRAINT fk_order_items_coupon FOREIGN KEY (coupon_id)
              REFERENCES discounts(id)
      );

      -- Tabela de métodos de pagamento
      CREATE TABLE payment_methods (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) UNIQUE NOT NULL
      );

      -- Tabela de pagamentos com referência à tabela payment_methods
      CREATE TABLE payments (
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
          CONSTRAINT fk_payments_order FOREIGN KEY (order_id)
              REFERENCES orders(id) ON DELETE RESTRICT,
          CONSTRAINT fk_payments_payment_method FOREIGN KEY (payment_method_id)
              REFERENCES payment_methods(id) ON DELETE RESTRICT
      );

      -- Índices para melhorar performance
      CREATE INDEX idx_addresses_profile_id ON addresses(profile_id);
      CREATE INDEX idx_phones_profile_id ON phones(profile_id);
      CREATE INDEX idx_cards_profile_id ON cards(profile_id);
      CREATE INDEX idx_orders_profile_id ON orders(profile_id);
      CREATE INDEX idx_order_items_order_id ON order_items(order_id);
      CREATE INDEX idx_discount_products_discount_id ON discount_products(discount_id);
      CREATE INDEX idx_payments_order_id ON payments(order_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_payments_order_id;
      DROP INDEX IF EXISTS idx_discount_products_discount_id;
      DROP INDEX IF EXISTS idx_order_items_order_id;
      DROP INDEX IF EXISTS idx_orders_profile_id;
      DROP INDEX IF EXISTS idx_cards_profile_id;
      DROP INDEX IF EXISTS idx_phones_profile_id;
      DROP INDEX IF EXISTS idx_addresses_profile_id;

      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS payment_methods;
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS discount_products;
      DROP TABLE IF EXISTS discounts;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS cards;
      DROP TABLE IF EXISTS phones;
      DROP TABLE IF EXISTS addresses;
      DROP TABLE IF EXISTS profile_pj;
      DROP TABLE IF EXISTS profile_pf;
      DROP TABLE IF EXISTS profiles;
      DROP TABLE IF EXISTS users;

      DROP TYPE IF EXISTS discount_scope_enum;
      DROP TYPE IF EXISTS discount_unit_enum;
      DROP TYPE IF EXISTS order_status_enum;
      DROP TYPE IF EXISTS profile_type_enum;
    `);
  }
} 