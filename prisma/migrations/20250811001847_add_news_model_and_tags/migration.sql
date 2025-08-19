-- CreateEnum
CREATE TYPE "public"."NewsCategory" AS ENUM ('MUNICIPAL_NEWS', 'DEVELOPMENT_PROJECTS', 'ANNOUNCEMENTS', 'COMMUNITY_EVENTS', 'INFRASTRUCTURE', 'ENVIRONMENTAL', 'SOCIAL_SERVICES', 'OTHER');

-- CreateTable
CREATE TABLE "public"."News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" "public"."NewsCategory" NOT NULL,
    "author" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_NewsToNewsTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NewsToNewsTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "News_category_idx" ON "public"."News"("category");

-- CreateIndex
CREATE INDEX "News_isPublished_idx" ON "public"."News"("isPublished");

-- CreateIndex
CREATE INDEX "News_featured_idx" ON "public"."News"("featured");

-- CreateIndex
CREATE INDEX "News_createdAt_idx" ON "public"."News"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsTag_name_key" ON "public"."NewsTag"("name");

-- CreateIndex
CREATE INDEX "NewsTag_name_idx" ON "public"."NewsTag"("name");

-- CreateIndex
CREATE INDEX "_NewsToNewsTag_B_index" ON "public"."_NewsToNewsTag"("B");

-- AddForeignKey
ALTER TABLE "public"."_NewsToNewsTag" ADD CONSTRAINT "_NewsToNewsTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_NewsToNewsTag" ADD CONSTRAINT "_NewsToNewsTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."NewsTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
