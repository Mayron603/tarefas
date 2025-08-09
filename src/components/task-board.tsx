
"use client";

import React, { useMemo } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';
import { ListFilter } from 'lucide-react';
import { Button } from './ui/button';
import { addDays, format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskBoardProps {
    initialTasks: Task[];
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const weekDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, []);

  const groupedTasksByDay = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    weekDays.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const tasksForDay = initialTasks.filter(task => isSameDay(parseISO(task.deadline), day));
        grouped.set(dayKey, tasksForDay);
    });
    return grouped;
  }, [initialTasks, weekDays]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Quadro Semanal</h2>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filtrar
            </Button>
        </div>
      </div>
      <div className="grid flex-1 gap-4 items-start auto-rows-max md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {weekDays.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const tasks = groupedTasksByDay.get(dayKey) || [];
            return (
              <div key={dayKey} className="w-full rounded-lg bg-card border p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 font-headline flex justify-between items-center capitalize">
                  {format(day, 'eeee', { locale: ptBR })}
                  <span className="text-sm font-normal text-muted-foreground">
                      {format(day, 'dd/MM')}
                  </span>
                  </h3>
                  <div className="space-y-4">
                  {tasks.length > 0 ? (
                      tasks.map(task => (
                          <TaskCard key={task.id} task={task} />
                      ))
                  ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa para este dia.</p>
                  )}
                  </div>
              </div>
            )
          })}
      </div>
    </div>
  );
}
