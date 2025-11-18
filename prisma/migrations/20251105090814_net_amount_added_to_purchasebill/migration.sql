/*
  Warnings:

  - You are about to alter the column `gross_discount` on the `purchase_bill` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,2)`.
  - You are about to alter the column `discount` on the `purchase_bill` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,2)`.
  - You are about to alter the column `tax` on the `purchase_bill` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,2)`.
  - You are about to alter the column `taxable_amount` on the `purchase_bill` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(6,2)`.
  - Added the required column `net_amount` to the `purchase_bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchase_bill" ADD COLUMN     "net_amount" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "gross_discount" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "tax" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "taxable_amount" SET DATA TYPE DECIMAL(6,2);
