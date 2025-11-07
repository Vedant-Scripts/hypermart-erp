/*
  Warnings:

  - A unique constraint covering the columns `[is_default]` on the table `barcode_setting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "barcode_setting_is_default_key" ON "barcode_setting"("is_default");
