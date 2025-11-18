/*
  Warnings:

  - The values [PURCHASE] on the enum `MovementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MovementType_new" AS ENUM ('PURCHASE_BILL', 'SALE', 'RETURN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT');
ALTER TABLE "stock_movement" ALTER COLUMN "type" TYPE "MovementType_new" USING ("type"::text::"MovementType_new");
ALTER TYPE "MovementType" RENAME TO "MovementType_old";
ALTER TYPE "MovementType_new" RENAME TO "MovementType";
DROP TYPE "public"."MovementType_old";
COMMIT;
