/*
  Warnings:

  - You are about to drop the `deliverables` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_sprint_id_fkey";

-- DropForeignKey
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_tfg_id_fkey";

-- DropForeignKey
ALTER TABLE "deliverables" DROP CONSTRAINT "deliverables_uploaded_by_fkey";

-- DropTable
DROP TABLE "deliverables";
