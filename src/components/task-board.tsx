
"use client";

import React, { useMemo } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';

interface TaskBoardProps {
    initialTasks: Task[];
}

const statusMap: { [key in TaskStatus]: string } = {
    todo: "A Fazer",
    inprogress: "Em Progresso",
    done: "Concluídas",
};

export function TaskBoard({ initialTasks }: TaskBoardProps) {
    const columns: TaskStatus[] = ['todo', 'inprogress', 'done'];

    const groupedTasks = useMemo(() => {
        const groups: Record<TaskStatus, Task[]> = {
            todo: [],
            inprogress: [],
            done: [],
        };
        initialTasks.forEach(task => {
            if (groups[task.status]) {
                groups[task.status].push(task);
            }
        });
        // Sort tasks within each group if needed, e.g., by priority or deadline
        return groups;
    }, [initialTasks]);

    return (
        <div className="flex flex-col h-full gap-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight font-headline">Quadro de Tarefas</h2>
            </div>
            <div className="grid flex-1 gap-4 items-start md:grid-cols-1 lg:grid-cols-3">
                {columns.map(status => (
                    <div key={status} className="w-full rounded-lg bg-card border p-4 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 font-headline flex justify-between items-center">
                            {statusMap[status]}
                             <span className="text-sm font-normal bg-primary/10 text-primary rounded-full px-2 py-0.5">
                                {groupedTasks[status].length}
                            </span>
                        </h3>
                        <div className="space-y-4">
                            {groupedTasks[status].length > 0 ? (
                                groupedTasks[status].map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa aqui.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
