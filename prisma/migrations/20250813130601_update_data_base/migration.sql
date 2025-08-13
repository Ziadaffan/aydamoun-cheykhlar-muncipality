/*
  Warnings:

  - You are about to drop the column `isPublished` on the `News` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."NewsCategory" ADD VALUE 'HEALTH_AND_SOCIAL_SERVICES';

-- DropIndex
DROP INDEX "public"."News_isPublished_idx";

-- AlterTable
ALTER TABLE "public"."News" DROP COLUMN "isPublished";
