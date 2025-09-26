/*
  Warnings:

  - You are about to drop the column `unit` on the `unit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unit_name]` on the table `unit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unit_name` to the `unit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."unit_unit_idx";

-- DropIndex
DROP INDEX "public"."unit_unit_key";

-- AlterTable
ALTER TABLE "public"."unit" DROP COLUMN "unit",
ADD COLUMN     "unit_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "unit_unit_name_key" ON "public"."unit"("unit_name");

-- CreateIndex
CREATE INDEX "unit_unit_name_idx" ON "public"."unit"("unit_name");
