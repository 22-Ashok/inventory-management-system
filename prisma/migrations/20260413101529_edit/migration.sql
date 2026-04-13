-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_password_set" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "l_name" DROP NOT NULL;
