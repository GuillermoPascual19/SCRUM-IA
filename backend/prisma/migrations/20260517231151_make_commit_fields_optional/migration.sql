-- DropForeignKey
ALTER TABLE "commits" DROP CONSTRAINT "commits_sprint_id_fkey";

-- DropForeignKey
ALTER TABLE "commits" DROP CONSTRAINT "commits_student_id_fkey";

-- AlterTable
ALTER TABLE "commits" ALTER COLUMN "sprint_id" DROP NOT NULL,
ALTER COLUMN "student_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
