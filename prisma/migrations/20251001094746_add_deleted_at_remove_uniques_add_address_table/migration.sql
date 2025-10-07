/*
  Warnings:

  - You are about to drop the column `emp_code` on the `employee_profile` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `user` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'DELIVERY_PERSON';

-- DropIndex
DROP INDEX "public"."employee_profile_emp_code_idx";

-- DropIndex
DROP INDEX "public"."user_contact_number_key";

-- DropIndex
DROP INDEX "public"."user_email_key";

-- AlterTable
ALTER TABLE "public"."employee_profile" DROP COLUMN "emp_code",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."address" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "label" TEXT,
    "line1" TEXT,
    "line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "address_user_id_idx" ON "public"."address"("user_id");

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
