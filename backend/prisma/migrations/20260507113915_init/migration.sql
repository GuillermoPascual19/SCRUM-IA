-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tfgs" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "academic_year" VARCHAR(10),
    "status" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "repository_url" VARCHAR(255),
    "github_token" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tutor_id" INTEGER NOT NULL,

    CONSTRAINT "tfgs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tfg_members" (
    "id" SERIAL NOT NULL,
    "scrum_role" VARCHAR(30),
    "tfg_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tfg_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stories" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "acceptance_criteria" TEXT,
    "story_points" INTEGER,
    "priority" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'backlog',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tfg_id" INTEGER NOT NULL,

    CONSTRAINT "user_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprints" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "goal" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'planificado',
    "tfg_id" INTEGER NOT NULL,

    CONSTRAINT "sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'to_do',
    "estimated_hours" DECIMAL(5,2),
    "actual_hours" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_story_id" INTEGER NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "assigned_to" INTEGER,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commits" (
    "id" SERIAL NOT NULL,
    "hash" VARCHAR(40) NOT NULL,
    "message" TEXT,
    "lines_added" INTEGER NOT NULL DEFAULT 0,
    "lines_deleted" INTEGER NOT NULL DEFAULT 0,
    "files_changed" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "tfg_id" INTEGER NOT NULL,
    "task_id" INTEGER,
    "sprint_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "commits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprint_activities" (
    "id" SERIAL NOT NULL,
    "total_commits" INTEGER NOT NULL DEFAULT 0,
    "completed_tasks" INTEGER NOT NULL DEFAULT 0,
    "lines_added" INTEGER NOT NULL DEFAULT 0,
    "lines_deleted" INTEGER NOT NULL DEFAULT 0,
    "completed_story_points" INTEGER NOT NULL DEFAULT 0,
    "logged_hours" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "sprint_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "sprint_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" SERIAL NOT NULL,
    "weight" INTEGER,
    "commits_score" DECIMAL(4,2),
    "tasks_score" DECIMAL(4,2),
    "final_score" DECIMAL(4,2),
    "comments" TEXT,
    "strengths" TEXT,
    "improvements" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_by_professor" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tfg_id" INTEGER NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tfg_final_grades" (
    "id" SERIAL NOT NULL,
    "sprints_average" DECIMAL(4,2),
    "final_score" DECIMAL(4,2),
    "final_comment" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_by_professor" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tfg_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "tfg_final_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retrospectives" (
    "id" SERIAL NOT NULL,
    "went_well" TEXT,
    "to_improve" TEXT,
    "actions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sprint_id" INTEGER NOT NULL,

    CONSTRAINT "retrospectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverables" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "file_url" VARCHAR(255),
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tfg_id" INTEGER NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "uploaded_by" INTEGER NOT NULL,

    CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tfg_members_tfg_id_user_id_key" ON "tfg_members"("tfg_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "commits_hash_key" ON "commits"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "sprint_activities_sprint_id_student_id_key" ON "sprint_activities"("sprint_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "tfg_final_grades_tfg_id_student_id_key" ON "tfg_final_grades"("tfg_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "retrospectives_sprint_id_key" ON "retrospectives"("sprint_id");

-- AddForeignKey
ALTER TABLE "tfgs" ADD CONSTRAINT "tfgs_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg_members" ADD CONSTRAINT "tfg_members_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg_members" ADD CONSTRAINT "tfg_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stories" ADD CONSTRAINT "user_stories_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_story_id_fkey" FOREIGN KEY ("user_story_id") REFERENCES "user_stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprint_activities" ADD CONSTRAINT "sprint_activities_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprint_activities" ADD CONSTRAINT "sprint_activities_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg_final_grades" ADD CONSTRAINT "tfg_final_grades_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg_final_grades" ADD CONSTRAINT "tfg_final_grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg_final_grades" ADD CONSTRAINT "tfg_final_grades_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retrospectives" ADD CONSTRAINT "retrospectives_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_tfg_id_fkey" FOREIGN KEY ("tfg_id") REFERENCES "tfgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
