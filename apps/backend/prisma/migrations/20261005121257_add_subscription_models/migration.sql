-- CreateTable
CREATE TABLE "subscription_tiers" (
    "id" TEXT NOT NULL,
    "polarProductId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "polarSubscriptionId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_tiers_polarProductId_key" ON "subscription_tiers"("polarProductId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_tiers_name_key" ON "subscription_tiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_subscriptions_polarSubscriptionId_key" ON "user_subscriptions"("polarSubscriptionId");

-- CreateIndex
CREATE INDEX "user_subscriptions_userId_idx" ON "user_subscriptions"("userId");

-- CreateIndex
CREATE INDEX "user_subscriptions_polarSubscriptionId_idx" ON "user_subscriptions"("polarSubscriptionId");

-- CreateIndex
CREATE INDEX "user_subscriptions_status_idx" ON "user_subscriptions"("status");

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "subscription_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
