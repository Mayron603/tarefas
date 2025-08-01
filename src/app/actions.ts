'use server';

import { suggestOptimalTaskDistribution } from '@/ai/flows/suggest-optimal-task-distribution';
import type { SuggestOptimalTaskDistributionInput } from '@/ai/flows/suggest-optimal-task-distribution';
import { teamMembers } from '@/lib/team';
import { getTasks, addTask as addTaskToDb, completeTask as completeTaskInDb, updateTaskStatus as updateTaskStatusInDb, deleteTask as deleteTaskInDb } from '@/lib/tasks';
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
  priority: 'low' | 'medium' | 'high';
  assigneeName?: string;
}) {

  const task = {
    title: data.title,
    description: data.description,
    deadline: data.deadline.toISOString(),
    priority: data.priority,
    assigneeName: data.assigneeName,
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

export async function startTask(taskId: string) {
    try {
        await updateTaskStatusInDb(taskId, 'inprogress');
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao mover a tarefa.' };
    }
}

export async function completeTask(taskId: string, resolution: string, proofImage?: string) {
    try {
        await completeTaskInDb(taskId, resolution, proofImage);
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao concluir a tarefa.' };
    }
}

export async function deleteTask(taskId: string) {
    try {
        await deleteTaskInDb(taskId);
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao excluir a tarefa.' };
    }
}
