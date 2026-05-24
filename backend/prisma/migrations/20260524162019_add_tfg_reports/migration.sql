-- CreateTable
CREATE TABLE "tfg_reports" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "custom_prompt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tfg_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "tfg_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tfg_reports" ADD CONSTRAINT "tfg_reports_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg_reports" ADD CONSTRAINT "tfg_reports_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
