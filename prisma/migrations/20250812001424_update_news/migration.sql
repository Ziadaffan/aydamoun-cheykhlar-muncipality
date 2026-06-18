/*
  Warnings:

  - You are about to drop the column `readTime` on the `News` table. All the data in the column will be lost.
  - The `imageUrl` column on the `News` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."News" DROP COLUMN "readTime",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];
