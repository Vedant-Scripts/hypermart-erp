/*
  Warnings:

  - You are about to drop the column `user_type` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."user_user_type_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "user_type";

-- DropEnum
DROP TYPE "public"."UserType";
