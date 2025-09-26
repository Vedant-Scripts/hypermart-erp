-- AlterTable
ALTER TABLE "public"."brand" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."unit" (
    "id" SERIAL NOT NULL,
    "unit" TEXT NOT NULL,
    "unit_code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unit_unit_key" ON "public"."unit"("unit");

-- CreateIndex
CREATE INDEX "unit_unit_idx" ON "public"."unit"("unit");
