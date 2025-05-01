-- AlterTable
ALTER TABLE "SchoolHistory" ADD COLUMN     "schoolId" TEXT;

-- AddForeignKey
ALTER TABLE "SchoolHistory" ADD CONSTRAINT "SchoolHistory_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
