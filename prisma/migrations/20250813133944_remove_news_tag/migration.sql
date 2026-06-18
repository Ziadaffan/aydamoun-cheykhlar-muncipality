/*
  Warnings:

  - You are about to drop the `NewsTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NewsToNewsTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_NewsToNewsTag" DROP CONSTRAINT "_NewsToNewsTag_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_NewsToNewsTag" DROP CONSTRAINT "_NewsToNewsTag_B_fkey";

-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "public"."NewsTag";

-- DropTable
DROP TABLE "public"."_NewsToNewsTag";
