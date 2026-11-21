-- Moments from our history no longer carry a period (year).
ALTER TABLE "public"."HistoryEntry" DROP COLUMN "period",
DROP COLUMN "periodEn";
