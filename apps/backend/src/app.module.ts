import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ProductModule } from './products/products.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, HealthModule, ProductModule],
})
export class AppModule {}
