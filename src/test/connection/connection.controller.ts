// src/test/connection/connection.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('connection-test')
export class ConnectionController {
  constructor(
    @InjectDataSource('default') private readonly postgres: DataSource,
    @InjectDataSource('oracle') private readonly oracle: DataSource,
  ) {}

  @Get()
  async testConnections() {
    const pgStatus = await this.postgres.isInitialized
      ? 'Postgres conectado ✅'
      : 'Postgres falhou ❌';

    let oracleStatus = 'Oracle não testado';
    try {
      const conn = await this.oracle.createQueryRunner().connect();
      await conn.release();
      oracleStatus = 'Oracle conectado ✅';
    } catch (error) {
      oracleStatus = `Oracle falhou ❌: ${error.message}`;
    }

    return { pgStatus, oracleStatus };
  }
}
