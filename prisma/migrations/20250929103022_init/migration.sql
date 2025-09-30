-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('APP_USER', 'ERP_USER', 'DELIVERY_USER');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."Shift" AS ENUM ('MORNING', 'EVENING', 'NIGHT');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE', 'USER');

-- CreateEnum
CREATE TYPE "public"."ContactType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'VENDOR');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'DELETED');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
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
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee_profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
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
    "id" TEXT NOT NULL,
    "barcode_prefix" TEXT NOT NULL,
    "barcode_series" BIGINT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barcode_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subcategory" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unit" (
    "id" TEXT NOT NULL,
    "unit_name" TEXT NOT NULL,
    "unit_code" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactManagement" (
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

    CONSTRAINT "ContactManagement_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "subcategory_name_key" ON "public"."subcategory"("name");

-- CreateIndex
CREATE INDEX "subcategory_name_idx" ON "public"."subcategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brand_name_key" ON "public"."brand"("name");

-- CreateIndex
CREATE INDEX "brand_name_idx" ON "public"."brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unit_unit_name_key" ON "public"."unit"("unit_name");

-- CreateIndex
CREATE UNIQUE INDEX "unit_unit_code_key" ON "public"."unit"("unit_code");

-- CreateIndex
CREATE INDEX "unit_unit_name_idx" ON "public"."unit"("unit_name");

-- AddForeignKey
ALTER TABLE "public"."employee_profile" ADD CONSTRAINT "employee_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barcode_setting" ADD CONSTRAINT "barcode_setting_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barcode_setting" ADD CONSTRAINT "barcode_setting_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subcategory" ADD CONSTRAINT "subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
