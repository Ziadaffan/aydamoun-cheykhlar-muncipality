-- News no longer has a summary: cards show a preview of the content instead.
-- Deploy the code that no longer reads/writes these columns BEFORE running this.
ALTER TABLE "public"."News" DROP COLUMN "excerpt",
DROP COLUMN "excerptEn";
