-- DropForeignKey
ALTER TABLE "public"."stock_movement" DROP CONSTRAINT "stock_movement_product_id_fkey";

-- AlterTable
ALTER TABLE "stock_movement" ALTER COLUMN "product_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "batch_purchase_bill_id_idx" ON "batch"("purchase_bill_id");

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
