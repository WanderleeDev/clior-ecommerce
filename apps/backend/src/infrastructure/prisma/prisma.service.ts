import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const PRISMA_CLIENT = 'PRISMA_CLIENT';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

export const PRISMA_PROVIDERS = [
  {
    provide: PRISMA_CLIENT,
    useClass: PrismaService,
  },
];
