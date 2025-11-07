/*
  Warnings:

  - Made the column `has_expiry` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "has_expiry" SET NOT NULL;
