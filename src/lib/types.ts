import { ObjectId } from "mongodb";

export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  _id: ObjectId;
  id: string; // string representation of _id
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  deadline: string; // ISO date string
  resolution?: string; // Text added when the task is marked as done
  assigneeName?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
  skills: string[];
  availability: string;
  currentWorkload: number;
}
