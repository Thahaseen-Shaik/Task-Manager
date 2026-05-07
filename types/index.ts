import { Project, Task, User } from "@prisma/client";
import { type Priority, type Role, type Status } from "@/lib/constants";

export type AppRole = Role;
export type AppStatus = Status;
export type AppPriority = Priority;

export type TaskWithRelations = Task & {
  project: Project;
  assignedTo: User | null;
};
