export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  deadline: string; // ISO date string
  assignee?: TeamMember;
}

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
  skills: string[];
  availability: string;
  currentWorkload: number;
}
