import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

// Seed with Faker.js — creates a coherent catalog + a few users/addresses/
// orders/payments/reviews so the front-end has realistic data to work with.
// Idempotent: deletes all rows (children first) before re-inserting.

// Load the backend's .env (apps/backend/.env holds DATABASE_URL) so the
// driver adapter below receives a real connection string at runtime.
void dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error(
    'DATABASE_URL is missing. Set it in apps/backend/.env and re-run the seed.',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: dbUrl }),
});

// ---------------------------------------------------------------------------
// Counts — tweak to taste
// ---------------------------------------------------------------------------
const COUNTS = {
  users: 10,
  categories: 10,
  products: 1000,
  reviewsPerProduct: [1, 5] as [number, number], // 1..5 reviews each
};

const HOUSE_BRAND = 'Clior';

const BRANDS = [
  'Clior',
  'Bark',
  'Bravecto',
  'Brit Care',
  'CanBo',
  'Catit',
  'Churu',
  'Dentastix',
  'Dog Chow',
  'Drontal',
  'Eukanuba',
  'Fancy Feast',
  'Felix',
  'Ferplast',
  'Fresh Step',
  'Friskies',
  'Frontline',
  'Furminator',
  'Greenies',
  'Hartz',
  "Hill's",
  'Kong',
  'LickiMat',
  'Meow Mix',
  'Mimaskot',
  'Naturalis',
  'NexGard',
  'Nutrican',
  'Pedigree',
  'PetCare+',
  'Pro Plan',
  'Purina One',
  'Ricocat',
  'Ricocan',
  'Royal Canin',
  'Simparica',
  'Super Can',
  'Super Cat',
  'Thor',
  'Tidy Cats',
  'Trixie',
  'Whiskas',
  'Zeedog',
] as const;

const ORDER_STATUSES = [
  { code: 'pending', label: 'Pendiente' },
  { code: 'paid', label: 'Pagado' },
  { code: 'shipped', label: 'Enviado' },
  { code: 'completed', label: 'Completado' },
  { code: 'cancelled', label: 'Cancelado' },
] as const;
const PAYMENT_STATUSES = [
  { code: 'pending', label: 'Pendiente' },
  { code: 'captured', label: 'Capturado' },
  { code: 'refunded', label: 'Reembolsado' },
  { code: 'failed', label: 'Fallido' },
] as const;

function randInt(min: number, max: number): number {
  return faker.number.int({ min, max });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function randElement<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

// ---------------------------------------------------------------------------
// Delete (children first so FK constraints don't blow up)
// ---------------------------------------------------------------------------
async function wipeAll(): Promise<void> {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  // Lookup tables last (no FK from rows already wiped)
  await prisma.paymentStatus.deleteMany();
  await prisma.orderStatus.deleteMany();
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  await wipeAll();

  // --- Lookup tables first (order/payment FK on statusId) ---
  const orderStatusMap = new Map<string, string>();
  for (const s of ORDER_STATUSES) {
    const row = await prisma.orderStatus.create({ data: { code: s.code, label: s.label } });
    orderStatusMap.set(s.code, row.id);
  }
  const paymentStatusMap = new Map<string, string>();
  for (const s of PAYMENT_STATUSES) {
    const row = await prisma.paymentStatus.create({ data: { code: s.code, label: s.label } });
    paymentStatusMap.set(s.code, row.id);
  }
  console.log(
    `Seeded ${ORDER_STATUSES.length} order statuses, ${PAYMENT_STATUSES.length} payment statuses`,
  );

  // --- Users + addresses (each user gets 1..3 addresses, first is default) ---
  const users = await Promise.all(
    Array.from({ length: COUNTS.users }, async (_, i) => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            provider: 'example.com',
          }),
          name: `${faker.person.firstName()} ${faker.person.lastName()}`,
          passwordHash: faker.string.alphanumeric(60), // hashed placeholder
        },
      });
      const addresses: string[] = [];
      const nAddresses = randInt(1, 3);
      for (let a = 0; a < nAddresses; a++) {
        const label = a === 0 ? 'Casa' : randElement(['Trabajo', 'Otro', 'Opción B', null]);
        const addr = await prisma.address.create({
          data: {
            userId: user.id,
            label,
            line1: faker.location.street(),
            line2: faker.location.buildingNumber(),
            city: faker.location.city(),
            province: faker.location.state(),
            postalCode: faker.string.alphanumeric(4),
            isDefault: a === 0,
          },
        });
        addresses.push(addr.id);
      }
      console.log(`  user[${i}] ${user.email} (${addresses.length} address(es))`);
      return { ...user, addressIds: addresses };
    }),
  );
  console.log(`Seeded ${users.length} users`);

  // --- Admin: role-based endpoints reject every faker user, so the admin
  // --- flow cannot be exercised locally without one. Uses a real argon2id
  // --- hash so the documented credentials actually log in.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin-test1!';
  const admin = await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@clior.test',
      name: 'Clior Admin',
      passwordHash: await argon2.hash(adminPassword, { type: argon2.argon2id }),
      role: 'admin',
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`Seeded admin ${admin.email} (password: ${adminPassword})`);

  // --- Categories (with slugs for URLs) ---
  const categories = await Promise.all(
    Array.from({ length: COUNTS.categories }, async (_, i) => {
      const name = faker.commerce.department();
      const slug =
        name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        (i ? `-${i}` : '');
      const cat = await prisma.category.create({ data: { name, slug } });
      console.log(`  category[${i}] ${cat.name} (slug: ${cat.slug})`);
      return cat;
    }),
  );
  console.log(`Seeded ${categories.length} categories`);

  // --- Brands (the 42 frontend brands, with slugs for URLs) ---
  const brands = await Promise.all(
    BRANDS.map((name) =>
      prisma.brand.create({ data: { name, slug: slugify(name) } }),
    ),
  );
  const brandByName = new Map(brands.map((b) => [b.name, b]));
  console.log(`Seeded ${brands.length} brands`);

  // --- Products (1000: every 4th is Clior house brand, rest round-robin) ---
  const products = await Promise.all(
    Array.from({ length: COUNTS.products }, async (_, i) => {
      const category = randElement(categories);
      const brandName = i % 4 === 0 ? HOUSE_BRAND : BRANDS[(i % (BRANDS.length - 1)) + 1];
      const brand = brandByName.get(brandName)!;
      const product = await prisma.product.create({
        data: {
          name: `${brandName} ${faker.commerce.productName()}`,
          description: faker.commerce.productDescription(),
          priceCents: randInt(1_000, 200_000), // $10 .. $2000
          imageUrl: `https://picsum.photos/seed/${i}/640/640`,
          categoryId: category.id,
          brandId: brand.id,
          stock: randInt(0, 50),
        },
      });
      return product;
    }),
  );
  console.log(`Seeded ${products.length} products`);

  // --- Orders + items + payments + address + user per order ---
  const nOrders = randInt(8, 20);
  console.log(`Creating ${nOrders} orders...`);
  for (let o = 0; o < nOrders; o++) {
    const user = randElement(users);
    const addressId = randElement(user.addressIds);
    const userForOrder = users.find((u) => u.id === user.id)!;

    // Pick 1..5 products for this order; freeze unitPriceCents at creation
    const picked = new Set<string>();
    while (picked.size < randInt(1, 5)) picked.add(randElement(products).id);
    const orderItems = Array.from(picked).map((productId) => {
      const p = products.find((pp) => pp.id === productId)!;
      // Congelar el precio del producto al momento de la compra
      return {
        productId,
        qty: randInt(1, 5),
        unitPriceCents: p.priceCents,
      };
    });

    // Invariante del diagrama: total = Σ(qty × unitPriceCents)
    const total = orderItems.reduce((acc, it) => acc + it.qty * it.unitPriceCents, 0);

    const orderStatusCode = randElement(ORDER_STATUSES).code;
    // Payment status derives loosely from order status
    const paymentStatusCode =
      orderStatusCode === 'cancelled'
        ? 'failed'
        : orderStatusCode === 'completed'
          ? 'captured'
          : orderStatusCode === 'shipped' || orderStatusCode === 'paid'
            ? 'captured'
            : 'pending';

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userForOrder.id } },
        address: { connect: { id: addressId } },
        status: { connect: { id: orderStatusMap.get(orderStatusCode)! } },
        total,
        items: { create: orderItems },
        payment: {
          create: {
            provider: randElement(['mp', 'stripe', 'paypal', 'mercadoPago']),
            amountCents: total, // congelado: iguala Order.total
            status: { connect: { id: paymentStatusMap.get(paymentStatusCode)! } },
            reference: faker.string.alphanumeric(24),
          },
        },
      },
      include: { payment: { include: { status: true } }, status: true },
    });
    console.log(
      `  order[${o}] ${order.status?.code ?? 'unknown'} total=$${(total / 100).toFixed(2)} (${orderItems.length} items, payment=${order.payment?.status?.code ?? 'unknown'})`,
    );
  }

  // --- Reviews: 1..5 per product from distinct users ---
  // Shuffling first guarantees no (productId, userId) pair repeats, which the
  // reviews_productId_userId_key unique constraint rejects.
  let reviewCount = 0;
  for (const product of products) {
    const nReviews = randInt(COUNTS.reviewsPerProduct[0], COUNTS.reviewsPerProduct[1]);
    const reviewers = faker.helpers.arrayElements(users, Math.min(nReviews, users.length));
    for (const user of reviewers) {
      const rating = randInt(1, 5);
      const review = await prisma.review.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating,
          comment:
            rating >= 4
              ? randElement([
                  'Excelente producto, muy buena calidad.',
                  'Cumple con lo esperado, lo recomiendo.',
                  'Buen producto para el precio.',
                  'Muy contento con la compra.',
                ])
              : randElement([
                  'Regular, no esperaba más.',
                  'La calidad no es la mejor.',
                  'Podría ser mejor, le falta algo.',
                  'No me convenció del todo.',
                ]),
        },
      });
      reviewCount++;
      void review;
    }
  }
  console.log(`Seeded ${reviewCount} reviews`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete.');
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
