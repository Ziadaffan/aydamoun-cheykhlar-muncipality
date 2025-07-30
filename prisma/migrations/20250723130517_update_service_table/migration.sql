/*
  Warnings:

  - You are about to drop the column `image` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `ServiceRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('LICENSEES_AND_CONSTRUCTION_SERVICES', 'ENVIRONMENTAL_SERVICES', 'ADMINISTRATIVE_SERVICES', 'DOWNLOAD_OFFICIAL_FORMS_SERVICES', 'COMPLAINTS_AND_SUGGESTIONS_SERVICES', 'OTHER');

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "image",
ADD COLUMN     "type" "ServiceType" NOT NULL;

-- DropTable
DROP TABLE "ServiceRequest";
