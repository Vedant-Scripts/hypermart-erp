-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('APP_USER', 'ERP_USER');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."Shift" AS ENUM ('MORNING', 'EVENING', 'NIGHT');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE', 'USER');

-- CreateEnum
CREATE TYPE "public"."ContactType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'VENDOR', 'OTHER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userType" "public"."UserType" NOT NULL,
    "role" "public"."Role" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "contactNumber" TEXT,
    "gender" "public"."Gender",
    "address" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmployeeProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "empCode" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "joiningDate" TIMESTAMP(3),
    "shift" "public"."Shift",
    "emergencyContactName" TEXT,
    "emergencyContactRelation" TEXT,
    "emergencyContactNumber" TEXT,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankIfscCode" TEXT,
    "bankBranch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_contactNumber_key" ON "public"."User"("contactNumber");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_userType_idx" ON "public"."User"("userType");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_userId_key" ON "public"."EmployeeProfile"("userId");

-- CreateIndex
CREATE INDEX "EmployeeProfile_userId_idx" ON "public"."EmployeeProfile"("userId");

-- CreateIndex
CREATE INDEX "EmployeeProfile_empCode_idx" ON "public"."EmployeeProfile"("empCode");

-- AddForeignKey
ALTER TABLE "public"."EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
