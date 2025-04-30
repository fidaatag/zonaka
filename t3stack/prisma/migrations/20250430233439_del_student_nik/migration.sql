/*
  Warnings:

  - You are about to drop the column `nik` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Student_nik_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "nik";
