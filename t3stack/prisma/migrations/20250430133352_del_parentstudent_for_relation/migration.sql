/*
  Warnings:

  - You are about to drop the `ParentStudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `relations` to the `Parent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParentStudent" DROP CONSTRAINT "ParentStudent_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ParentStudent" DROP CONSTRAINT "ParentStudent_studentId_fkey";

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "relations" TEXT NOT NULL;

-- DropTable
DROP TABLE "ParentStudent";
