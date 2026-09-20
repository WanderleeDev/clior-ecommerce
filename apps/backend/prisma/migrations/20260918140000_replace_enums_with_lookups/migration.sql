-- Create lookup tables
CREATE TABLE "order_statuses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "order_statuses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_statuses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "payment_statuses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "order_statuses_code_key" ON "order_statuses"("code");
CREATE UNIQUE INDEX "payment_statuses_code_key" ON "payment_statuses"("code");

-- Seed lookup rows
INSERT INTO "order_statuses" ("code", "label")
VALUES ('pending', 'Pendiente'), ('paid', 'Pagado'), ('shipped', 'Enviado'), ('completed', 'Completado'), ('cancelled', 'Cancelado');

INSERT INTO "payment_statuses" ("code", "label")
VALUES ('pending', 'Pendiente'), ('captured', 'Capturado'), ('refunded', 'Reembolsado'), ('failed', 'Fallido');

-- Add statusId to orders (nullable first, backfill, then make NOT NULL)
ALTER TABLE "orders" ADD COLUMN "statusId" TEXT;
UPDATE "orders" SET "statusId" = (SELECT "id" FROM "order_statuses" WHERE "code" = "status"::text);
ALTER TABLE "orders" ALTER COLUMN "statusId" SET NOT NULL;
ALTER TABLE "orders" ADD CONSTRAINT "orders_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "order_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add statusId to payments (nullable first, backfill, then make NOT NULL)
ALTER TABLE "payments" ADD COLUMN "statusId" TEXT;
UPDATE "payments" SET "statusId" = (SELECT "id" FROM "payment_statuses" WHERE "code" = "status"::text);
ALTER TABLE "payments" ALTER COLUMN "statusId" SET NOT NULL;
ALTER TABLE "payments" ADD CONSTRAINT "payments_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "payment_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old enum columns
ALTER TABLE "orders" DROP COLUMN "status";
ALTER TABLE "payments" DROP COLUMN "status";

-- Drop old native enum types
DROP TYPE "OrderStatus";
DROP TYPE "PaymentStatus";

-- Add indexes
CREATE INDEX "orders_statusId_idx" ON "orders"("statusId");
CREATE INDEX "payments_statusId_idx" ON "payments"("statusId");
