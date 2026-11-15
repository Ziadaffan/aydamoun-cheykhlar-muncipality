-- English versions of every admin-written text. Additive only: nullable columns;
-- a missing English value falls back to the Arabic one everywhere.

-- AlterTable
ALTER TABLE "public"."Council" ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "roleEn" TEXT,
ADD COLUMN     "majorEn" TEXT;

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT;

-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "excerptEn" TEXT;

-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT;

-- AlterTable
ALTER TABLE "public"."Jobs" ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "providerEn" TEXT,
ADD COLUMN     "locationEn" TEXT;

-- AlterTable
ALTER TABLE "public"."Association" ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT;

-- AlterTable
ALTER TABLE "public"."TaxiStop" ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "fromLocationEn" TEXT,
ADD COLUMN     "toLocationEn" TEXT;

-- AlterTable
ALTER TABLE "public"."Announcement" ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "bodyEn" TEXT;

-- AlterTable
ALTER TABLE "public"."HistoryEntry" ADD COLUMN     "periodEn" TEXT,
ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT;
