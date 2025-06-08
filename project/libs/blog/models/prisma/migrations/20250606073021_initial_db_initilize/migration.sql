-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('TEXT', 'VIDEO', 'QUOTE', 'PHOTO', 'LINK');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Post"
(
  "id"             TEXT         NOT NULL,
  "userId"         TEXT         NOT NULL,
  "type"           "PostType"   NOT NULL,
  "payload"        JSONB        NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publishedAt"    TIMESTAMP(3) NOT NULL,
  "status"         "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
  "isRepost"       BOOLEAN      NOT NULL DEFAULT false,
  "originalPostId" TEXT,

  CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag"
(
  "id"   TEXT NOT NULL,
  "name" TEXT NOT NULL,

  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like"
(
  "userId"    TEXT         NOT NULL,
  "postId"    TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Like_pkey" PRIMARY KEY ("userId", "postId")
);

-- CreateTable
CREATE TABLE "Comment"
(
  "id"        TEXT         NOT NULL,
  "userId"    TEXT         NOT NULL,
  "postId"    TEXT         NOT NULL,
  "text"      TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription"
(
  "followerId"  TEXT NOT NULL,
  "followingId" TEXT NOT NULL,

  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("followerId", "followingId")
);

-- CreateTable
CREATE TABLE "_PostTags"
(
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,

  CONSTRAINT "_PostTags_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_originalPostId_key" ON "Post" ("originalPostId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag" ("name");

-- CreateIndex
CREATE INDEX "_PostTags_B_index" ON "_PostTags" ("B");

-- AddForeignKey
ALTER TABLE "Post"
  ADD CONSTRAINT "Post_originalPostId_fkey" FOREIGN KEY ("originalPostId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like"
  ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment"
  ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTags"
  ADD CONSTRAINT "_PostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTags"
  ADD CONSTRAINT "_PostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
