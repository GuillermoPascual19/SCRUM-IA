export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher" | "coordinator" | "admin";
  createdAt: string;
}

export interface Tfg {
  id: number;
  title: string;
  description?: string;
  academicYear?: string;
  status: string;
  repositoryUrl?: string;
  tutorId: number;
  tutor?: Pick<User, "id" | "name" | "email">;
  createdAt: string;
}

export interface TfgMember {
  id: number;
  tfgId: number;
  userId: number;
  scrumRole?: string;
  user: Pick<User, "id" | "name" | "email" | "role">;
}

export interface Sprint {
  id: number;
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  tfgId: number;
}

export interface UserStory {
  id: number;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority?: number;
  status: string;
  tfgId: number;
  tasks?: Task[];
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "to_do" | "in_progress" | "done";
  estimatedHours?: number;
  actualHours?: number;
  userStoryId: number;
  sprintId: number;
  assignedTo?: number;
  assignee?: Pick<User, "id" | "name" | "email">;
  createdAt: string;
}

export interface Retrospective {
  id: number;
  sprintId: number;
  wentWell?: string;
  toImprove?: string;
  actions?: string;
  createdAt: string;
}

export interface Evaluation {
  id: number;
  tfgId: number;
  sprintId: number;
  studentId: number;
  professorId: number;
  weight?: number;
  commitsScore?: number;
  tasksScore?: number;
  finalScore?: number;
  comments?: string;
  strengths?: string;
  improvements?: string;
  aiGenerated: boolean;
  reviewedByProfessor: boolean;
  createdAt: string;
}

export interface Tfg {
  id: number;
  title: string;
  description?: string;
  academicYear?: string;
  status: string;
  repositoryUrl?: string;
  tutorId: number;
  tutor?: Pick<User, "id" | "name" | "email">;
  members?: TfgMember[];
  createdAt: string;
}