/*
  Warnings:

  - The values [VENDOR] on the enum `ContactType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[contact_number]` on the table `ContactManagement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ContactType_new" AS ENUM ('CUSTOMER', 'SUPPLIER');
ALTER TABLE "public"."ContactManagement" ALTER COLUMN "type" TYPE "public"."ContactType_new" USING ("type"::text::"public"."ContactType_new");
ALTER TYPE "public"."ContactType" RENAME TO "ContactType_old";
ALTER TYPE "public"."ContactType_new" RENAME TO "ContactType";
DROP TYPE "public"."ContactType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "ContactManagement_contact_number_key" ON "public"."ContactManagement"("contact_number");
