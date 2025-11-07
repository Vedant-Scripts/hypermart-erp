-- DropForeignKey
ALTER TABLE "public"."batch" DROP CONSTRAINT "batch_product_id_fkey";

-- AlterTable
ALTER TABLE "batch" ALTER COLUMN "product_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
