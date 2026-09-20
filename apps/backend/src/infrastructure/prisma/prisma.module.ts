import { Global, Module } from '@nestjs/common';
import { PrismaService, PRISMA_PROVIDERS } from './prisma.service';

@Global()
@Module({
  providers: PRISMA_PROVIDERS,
  exports: [PrismaService],
})
export class PrismaModule {}
