"use client";

import React, { useMemo } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';
import { ListFilter } from 'lucide-react';
import { Button } from './ui/button';

const statusColumns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'inprogress', title: 'Em Progresso' },
  { id: 'done', title: 'Concluído' },
];

interface TaskBoardProps {
    initialTasks: Task[];
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const groupedTasks = useMemo(() => {
    return initialTasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [initialTasks]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Quadro de Tarefas</h2>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filtrar
            </Button>
        </div>
      </div>
      <div className="grid flex-1 gap-6 items-start auto-rows-max md:grid-cols-2 lg:grid-cols-3">
          {statusColumns.map(column => (
          <div key={column.id} className="w-full rounded-lg bg-card border p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 font-headline flex justify-between items-center">
              {column.title}
              <span className="text-sm font-normal text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                  {groupedTasks[column.id]?.length || 0}
              </span>
              </h3>
              <div className="space-y-4">
              {(groupedTasks[column.id] || []).length > 0 ? (
                  (groupedTasks[column.id] || []).map(task => (
                      <TaskCard key={task.id} task={task} />
                  ))
              ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma tarefa aqui.</p>
              )}
              </div>
          </div>
          ))}
      </div>
    </div>
  );
}
