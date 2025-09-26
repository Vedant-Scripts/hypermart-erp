/*
  Warnings:

  - You are about to drop the `BarcodeSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmployeeProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BarcodeSetting" DROP CONSTRAINT "BarcodeSetting_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."BarcodeSetting" DROP CONSTRAINT "BarcodeSetting_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."EmployeeProfile" DROP CONSTRAINT "EmployeeProfile_userId_fkey";

-- DropTable
DROP TABLE "public"."BarcodeSetting";

-- DropTable
DROP TABLE "public"."Brand";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."EmployeeProfile";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_type" "public"."UserType" NOT NULL,
    "role" "public"."Role" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT,
    "contact_number" TEXT,
    "gender" "public"."Gender",
    "address" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee_profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emp_code" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "joining_date" TIMESTAMP(3),
    "shift" "public"."Shift",
    "emergency_contact_name" TEXT,
    "emergency_contact_relation" TEXT,
    "emergency_contact_number" TEXT,
    "bank_name" TEXT,
    "bank_account_number" TEXT,
    "bank_ifsc_code" TEXT,
    "bank_branch" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barcode_setting" (
    "id" SERIAL NOT NULL,
    "barcode_prefix" TEXT NOT NULL,
    "barcode_series" BIGINT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barcode_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_contact_number_key" ON "public"."user"("contact_number");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "public"."user"("role");

-- CreateIndex
CREATE INDEX "user_user_type_idx" ON "public"."user"("user_type");

-- CreateIndex
CREATE UNIQUE INDEX "employee_profile_user_id_key" ON "public"."employee_profile"("user_id");

-- CreateIndex
CREATE INDEX "employee_profile_user_id_idx" ON "public"."employee_profile"("user_id");

-- CreateIndex
CREATE INDEX "employee_profile_emp_code_idx" ON "public"."employee_profile"("emp_code");

-- CreateIndex
CREATE UNIQUE INDEX "barcode_setting_barcode_series_key" ON "public"."barcode_setting"("barcode_series");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "public"."category"("name");

-- CreateIndex
CREATE INDEX "category_name_idx" ON "public"."category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brand_name_key" ON "public"."brand"("name");

-- CreateIndex
CREATE INDEX "brand_name_idx" ON "public"."brand"("name");

-- AddForeignKey
ALTER TABLE "public"."employee_profile" ADD CONSTRAINT "employee_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barcode_setting" ADD CONSTRAINT "barcode_setting_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barcode_setting" ADD CONSTRAINT "barcode_setting_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
