import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

void dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to clean database in production (NODE_ENV=production).');
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is missing. Set it in apps/backend/.env.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: dbUrl }),
});

async function main(): Promise<void> {
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.authToken.deleteMany();
  await prisma.refreshSession.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.paymentStatus.deleteMany();
  await prisma.orderStatus.deleteMany();
  console.log('Database cleaned.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Clean failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
