-- "Living app": announcements, village history timeline, council roles, admin-defined
-- service forms and per-topic / per-locale push notifications. Additive only: every
-- new column is nullable or has a default, so existing rows and older clients keep working.

-- CreateEnum
CREATE TYPE "public"."AnnouncementPriority" AS ENUM ('NORMAL', 'IMPORTANT', 'URGENT');

-- AlterTable
ALTER TABLE "public"."Council" ADD COLUMN     "major" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "role" TEXT;

-- AlterTable
ALTER TABLE "public"."PushToken" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'ar',
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY['announcements', 'news', 'jobs', 'taxiStops', 'requests']::TEXT[],
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fields" JSONB,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "priority" "public"."AnnouncementPriority" NOT NULL DEFAULT 'NORMAL',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoryEntry" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Announcement_createdAt_idx" ON "public"."Announcement"("createdAt");

-- CreateIndex
CREATE INDEX "PushToken_userId_idx" ON "public"."PushToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."PushToken" ADD CONSTRAINT "PushToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
