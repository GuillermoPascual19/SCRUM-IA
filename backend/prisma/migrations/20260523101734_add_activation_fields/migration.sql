-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activation_token" VARCHAR(255),
ADD COLUMN     "activation_token_expires" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
