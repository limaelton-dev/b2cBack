import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUsersTableToUser1714561400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro, remover as restrições de chave estrangeira que referenciam a tabela users
    await queryRunner.query(`
      ALTER TABLE profiles DROP CONSTRAINT fk_profiles_user;
    `);

    // Renomear a tabela users para user
    await queryRunner.query(`
      ALTER TABLE users RENAME TO "user";
    `);

    // Recriar as restrições de chave estrangeira apontando para a nova tabela user
    await queryRunner.query(`
      ALTER TABLE profiles ADD CONSTRAINT fk_profiles_user 
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter as alterações: primeiro remover as restrições
    await queryRunner.query(`
      ALTER TABLE profiles DROP CONSTRAINT fk_profiles_user;
    `);

    // Renomear a tabela de volta para users
    await queryRunner.query(`
      ALTER TABLE "user" RENAME TO users;
    `);

    // Recriar as restrições apontando para a tabela original
    await queryRunner.query(`
      ALTER TABLE profiles ADD CONSTRAINT fk_profiles_user 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    `);
  }
} 