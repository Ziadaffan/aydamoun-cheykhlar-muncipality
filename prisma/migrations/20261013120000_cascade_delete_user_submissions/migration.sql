-- Deleting a user must also remove their service submissions, otherwise the
-- account-deletion endpoint fails on the RESTRICT foreign key.

-- DropForeignKey
ALTER TABLE "public"."ServiceSubmission" DROP CONSTRAINT "ServiceSubmission_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ServiceSubmission" ADD CONSTRAINT "ServiceSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
