'use server';

import { suggestOptimalTaskDistribution } from '@/ai/flows/suggest-optimal-task-distribution';
import type { SuggestOptimalTaskDistributionInput } from '@/ai/flows/suggest-optimal-task-distribution';
import { addTask as addTaskToDb, completeTask as completeTaskInDb, deleteTask as deleteTaskInDb, getTasks, updateTaskStatus as updateTaskStatusInDb } from '@/lib/tasks';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { getUserById } from '@/lib/users';

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
    const session = await getSession();
    if (!session?.userId) {
        console.error("fetchTasks: No session found");
        return [];
    }
    const tasks = await getTasks(session.userId);
    return tasks;
}

export async function addTask(data: {
  title: string;
  description?: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  assigneeName?: string;
}) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, error: 'Usuário não autenticado.' };
    }

    const task = {
      title: data.title,
      description: data.description,
      deadline: data.deadline.toISOString(),
      priority: data.priority,
      assigneeName: data.assigneeName,
      userId: session.userId,
    };

    await addTaskToDb(task);
    revalidatePath('/');
    revalidatePath('/feedbacks');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Falha ao adicionar a tarefa.' };
  }
}

export async function startTask(taskId: string) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: 'Usuário não autenticado.' };
    }
    try {
        await updateTaskStatusInDb(taskId, 'inprogress', session.userId);
        revalidatePath('/');
        revalidatePath('/feedbacks');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao mover a tarefa.' };
    }
}

export async function completeTask(taskId: string, resolution: string, proofImage?: string) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: 'Usuário não autenticado.' };
    }
    try {
        await completeTaskInDb(taskId, resolution, session.userId, proofImage);
        revalidatePath('/');
        revalidatePath('/feedbacks');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao concluir a tarefa.' };
    }
}

export async function deleteTask(taskId: string) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: 'Usuário não autenticado.' };
    }
    try {
        await deleteTaskInDb(taskId, session.userId);
        revalidatePath('/');
        revalidatePath('/feedbacks');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao excluir a tarefa.' };
    }
}

export async function getUserData() {
    const session = await getSession();
    if (!session?.userId) return null;

    try {
        const user = await getUserById(session.userId);
        return user;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
    }
}
