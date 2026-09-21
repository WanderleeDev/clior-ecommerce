import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { validateEnvironment } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';
import { ProductModule } from './modules/products/products.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    HealthModule,
    ProductModule,
  ],
})
export class AppModule {}
