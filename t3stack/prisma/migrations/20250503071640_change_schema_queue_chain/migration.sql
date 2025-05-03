/*
  Warnings:

  - You are about to drop the `ChainPushHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PushQueue` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PushStatus" AS ENUM ('pending', 'pushed', 'failed');

-- DropForeignKey
ALTER TABLE "ChainPushHistory" DROP CONSTRAINT "ChainPushHistory_studentId_fkey";

-- DropForeignKey
ALTER TABLE "PushQueue" DROP CONSTRAINT "PushQueue_studentId_fkey";

-- DropTable
DROP TABLE "ChainPushHistory";

-- DropTable
DROP TABLE "PushQueue";

-- CreateTable
CREATE TABLE "QueuePushChain" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "ready" BOOLEAN NOT NULL DEFAULT false,
    "status" "PushStatus" NOT NULL DEFAULT 'pending',
    "chainTxId" TEXT,
    "explorerUrl" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueuePushChain_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueuePushChain" ADD CONSTRAINT "QueuePushChain_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
