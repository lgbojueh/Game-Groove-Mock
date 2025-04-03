-- AlterTable
ALTER TABLE "users" ADD "resetToken" TEXT;
ALTER TABLE "users" ADD "resetTokenExpiry" TIMESTAMP(3);
