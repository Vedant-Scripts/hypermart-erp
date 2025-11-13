/*
  Warnings:

  - The values [percent,rupee] on the enum `FlatDiscountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `tax_amount` on the `purchase_bill` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FlatDiscountType_new" AS ENUM ('PERCENT', 'RUPEE');
ALTER TABLE "purchase_bill" ALTER COLUMN "flat_discount_type" TYPE "FlatDiscountType_new" USING ("flat_discount_type"::text::"FlatDiscountType_new");
ALTER TYPE "FlatDiscountType" RENAME TO "FlatDiscountType_old";
ALTER TYPE "FlatDiscountType_new" RENAME TO "FlatDiscountType";
DROP TYPE "public"."FlatDiscountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "purchase_bill" DROP COLUMN "tax_amount",
ADD COLUMN     "taxable_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "payment_status" SET DEFAULT 'PENDING',
ALTER COLUMN "flat_discount_type" SET DEFAULT 'PERCENT',
ALTER COLUMN "flat_discount" SET DEFAULT 0,
ALTER COLUMN "gross_discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "tax" SET DEFAULT 0,
ALTER COLUMN "round_off" SET DEFAULT 0;
