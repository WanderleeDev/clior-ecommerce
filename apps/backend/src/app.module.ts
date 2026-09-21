import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HealthModule } from './health/health.module';
import { ProductModule } from './products/products.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [EventEmitterModule.forRoot(), PrismaModule, HealthModule, ProductModule],
})
export class AppModule {}
