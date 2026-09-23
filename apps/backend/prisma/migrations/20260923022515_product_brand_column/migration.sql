-- AlterTable
ALTER TABLE "products" ADD COLUMN     "brand" TEXT;

-- CreateIndex
CREATE INDEX "products_brand_idx" ON "products"("brand");
