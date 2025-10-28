/*
  Warnings:

  - You are about to drop the `batch_setting` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PRODUCT', 'VARIANT');

-- DropIndex
DROP INDEX "public"."product_item_code_key";

-- DropIndex
DROP INDEX "public"."variant_item_code_key";

-- DropTable
DROP TABLE "public"."batch_setting";

-- CreateTable
CREATE TABLE "item_code_registry" (
    "id" TEXT NOT NULL,
    "item_code" TEXT NOT NULL,
    "entity_type" "EntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_code_registry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_code_registry_item_code_key" ON "item_code_registry"("item_code");

-- CreateIndex
CREATE INDEX "item_code_registry_item_code_idx" ON "item_code_registry"("item_code");
