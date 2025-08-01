'use server';

import { suggestOptimalTaskDistribution } from '@/ai/flows/suggest-optimal-task-distribution';
import type { SuggestOptimalTaskDistributionInput } from '@/ai/flows/suggest-optimal-task-distribution';
import { teamMembers } from '@/lib/team';
import { getTasks, addTask as addTaskToDb } from '@/lib/tasks';
import { revalidatePath } from 'next/cache';

export async function getTaskDistributionSuggestions(
  input: SuggestOptimalTaskDistributionInput
) {
  try {
    const suggestions = await suggestOptimalTaskDistribution(input);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get AI suggestions. Please check the AI flow configuration.' };
  }
}

export async function fetchTasks() {
  return await getTasks();
}

export async function addTask(data: {
  title: string;
  description?: string;
  deadline: Date;
  assigneeId?: string;
  priority: 'low' | 'medium' | 'high';
}) {
  const task = {
    title: data.title,
    description: data.description,
    deadline: data.deadline.toISOString(),
    assigneeId: data.assigneeId,
    priority: data.priority,
    status: 'todo' as const,
  };

  try {
    await addTaskToDb(task);
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Falha ao adicionar a tarefa.' };
  }
}
