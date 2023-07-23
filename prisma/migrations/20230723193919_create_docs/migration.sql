/*
  Warnings:

  - You are about to drop the `pokemon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pokemon";

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "translator" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);
