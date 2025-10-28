/*
  Warnings:

  - You are about to drop the column `is_default` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `stock_movement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "batch" DROP COLUMN "is_default";

-- AlterTable
ALTER TABLE "stock_movement" DROP COLUMN "note";

-- CreateTable
CREATE TABLE "batch_setting" (
    "id" TEXT NOT NULL,
    "batch_prefix" TEXT NOT NULL,
    "batch_series" BIGINT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batch_setting_batch_series_key" ON "batch_setting"("batch_series");

-- CreateSequence
CREATE SEQUENCE IF NOT EXISTS "batch_no_seq" START 1;