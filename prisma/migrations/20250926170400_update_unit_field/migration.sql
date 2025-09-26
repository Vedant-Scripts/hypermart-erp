/*
  Warnings:

  - A unique constraint covering the columns `[unit_code]` on the table `unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "unit_unit_code_key" ON "public"."unit"("unit_code");
