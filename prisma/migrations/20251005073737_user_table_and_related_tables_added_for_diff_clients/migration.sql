/*
  Warnings:

  - You are about to drop the `ContactManagement` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "allowedPlatforms" TEXT[],
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "contact_number" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."ContactManagement";

-- CreateTable
CREATE TABLE "public"."platform_clients" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_allowed_client" (
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "user_allowed_client_pkey" PRIMARY KEY ("userId","clientId")
);

-- CreateTable
CREATE TABLE "public"."contact_management" (
    "id" TEXT NOT NULL,
    "type" "public"."ContactType" NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "contact_number" TEXT,
    "company_name" TEXT,
    "gstin" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" INTEGER,
    "bank_name" TEXT,
    "branch_name" TEXT,
    "ifsc_code" TEXT,
    "account_name" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_management_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_clients_clientId_key" ON "public"."platform_clients"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "contact_management_contact_number_key" ON "public"."contact_management"("contact_number");

-- CreateIndex
CREATE INDEX "contact_management_type_idx" ON "public"."contact_management"("type");

-- AddForeignKey
ALTER TABLE "public"."user_allowed_client" ADD CONSTRAINT "user_allowed_client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_allowed_client" ADD CONSTRAINT "user_allowed_client_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."platform_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
