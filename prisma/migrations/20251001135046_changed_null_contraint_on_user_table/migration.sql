/*
  Warnings:

  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact_number` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."address" ALTER COLUMN "isDefault" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "contact_number" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;
