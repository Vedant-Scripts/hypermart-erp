/*
  Warnings:

  - You are about to drop the column `clientId` on the `platform_clients` table. All the data in the column will be lost.
  - The primary key for the `user_allowed_client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientId` on the `user_allowed_client` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_allowed_client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[client_id]` on the table `platform_clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_id` to the `platform_clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `user_allowed_client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_allowed_client` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SINGLE', 'VARIANT');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT');

-- DropForeignKey
ALTER TABLE "public"."user_allowed_client" DROP CONSTRAINT "user_allowed_client_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_allowed_client" DROP CONSTRAINT "user_allowed_client_userId_fkey";

-- DropIndex
DROP INDEX "public"."platform_clients_clientId_key";

-- AlterTable
ALTER TABLE "platform_clients" DROP COLUMN "clientId",
ADD COLUMN     "client_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_allowed_client" DROP CONSTRAINT "user_allowed_client_pkey",
DROP COLUMN "clientId",
DROP COLUMN "userId",
ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "user_allowed_client_pkey" PRIMARY KEY ("user_id", "client_id");

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "item_code" TEXT,
    "product_name" TEXT NOT NULL,
    "print_name" TEXT NOT NULL,
    "product_type" "ProductType" NOT NULL,
    "category_id" TEXT NOT NULL,
    "subcategory_id" TEXT,
    "brand_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "hsn_code" TEXT,
    "purchase_tax" TEXT NOT NULL,
    "sales_tax" TEXT NOT NULL,
    "purchase_tax_including" BOOLEAN NOT NULL DEFAULT false,
    "sales_tax_including" BOOLEAN NOT NULL DEFAULT true,
    "manage_multiple_batch" BOOLEAN NOT NULL DEFAULT true,
    "has_expiry" BOOLEAN DEFAULT true,
    "description" TEXT,
    "short_desc" TEXT,
    "cached_qty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "item_code" TEXT NOT NULL,
    "variant_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cached_qty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "batch_no" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "mfg_date" TIMESTAMP(3),
    "exp_date" TIMESTAMP(3),
    "exp_days" INTEGER,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "landing_cost" DECIMAL(10,2) NOT NULL,
    "mrp" DECIMAL(10,2) NOT NULL,
    "selling_discount" DECIMAL(6,2) NOT NULL,
    "selling_price" DECIMAL(10,2) NOT NULL,
    "selling_margin" DECIMAL(6,2) NOT NULL,
    "available_qty" INTEGER NOT NULL DEFAULT 0,
    "received_qty" INTEGER NOT NULL DEFAULT 0,
    "supplier_id" TEXT,
    "supplier_bill_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "batch_id" TEXT NOT NULL,
    "type" "MovementType" NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2),
    "reference_type" TEXT,
    "reference_id" TEXT,
    "note" TEXT,
    "created_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_item_code_key" ON "product"("item_code");

-- CreateIndex
CREATE INDEX "product_product_name_idx" ON "product"("product_name");

-- CreateIndex
CREATE INDEX "product_brand_id_idx" ON "product"("brand_id");

-- CreateIndex
CREATE INDEX "product_category_id_idx" ON "product"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "variant_item_code_key" ON "variant"("item_code");

-- CreateIndex
CREATE INDEX "variant_product_id_idx" ON "variant"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "batch_batch_no_key" ON "batch"("batch_no");

-- CreateIndex
CREATE INDEX "stock_movement_product_id_idx" ON "stock_movement"("product_id");

-- CreateIndex
CREATE INDEX "stock_movement_variant_id_idx" ON "stock_movement"("variant_id");

-- CreateIndex
CREATE INDEX "stock_movement_batch_id_idx" ON "stock_movement"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "platform_clients_client_id_key" ON "platform_clients"("client_id");

-- AddForeignKey
ALTER TABLE "user_allowed_client" ADD CONSTRAINT "user_allowed_client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_allowed_client" ADD CONSTRAINT "user_allowed_client_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "platform_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant" ADD CONSTRAINT "variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "contact_management"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
