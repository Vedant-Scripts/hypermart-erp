/*
  Warnings:

  - You are about to drop the column `supplier_bill_id` on the `batch` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('DONE', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "FlatDiscountType" AS ENUM ('percent', 'rupee');

-- AlterTable
ALTER TABLE "batch" RENAME COLUMN "supplier_bill_id" TO "purchase_bill_id";


-- CreateTable
CREATE TABLE "purchase_bill" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "purchase_bill_date" TIMESTAMP(3) NOT NULL,
    "purchase_bill_no" TEXT NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "flat_discount_type" "FlatDiscountType" NOT NULL,
    "flat_discount" DECIMAL(65,30) NOT NULL,
    "gross_discount" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "tax_amount" DECIMAL(65,30) NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL,
    "round_off" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_bill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_purchase_bill_id_fkey" FOREIGN KEY ("purchase_bill_id") REFERENCES "purchase_bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
