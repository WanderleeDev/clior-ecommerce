-- CreateIndex
CREATE INDEX "products_createdAt_id_idx" ON "products"("createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "products_categoryId_createdAt_id_idx" ON "products"("categoryId", "createdAt" DESC, "id" DESC);
