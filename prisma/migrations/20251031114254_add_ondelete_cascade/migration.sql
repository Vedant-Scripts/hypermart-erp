-- DropForeignKey
ALTER TABLE "public"."batch" DROP CONSTRAINT "batch_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."batch" DROP CONSTRAINT "batch_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."variant" DROP CONSTRAINT "variant_product_id_fkey";

-- AlterTable
ALTER TABLE "stock_movement" ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "variant" ADD CONSTRAINT "variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
