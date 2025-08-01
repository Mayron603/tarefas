"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GripVertical, ListFilter } from 'lucide-react';
import { fetchTasks } from '@/app/actions';
import { teamMembers } from '@/lib/team';
import { Skeleton } from './ui/skeleton';

const statusColumns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'inprogress', title: 'Em Progresso' },
  { id: 'done', title: 'Concluído' },
];

function TaskBoardPlaceholder() {
    return (
        <div className="grid flex-1 gap-6 items-start auto-rows-max md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {statusColumns.map(column => (
                <div key={column.id} className="w-full rounded-lg bg-card border p-4 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 font-headline flex justify-between items-center">
                        {column.title}
                         <span className="text-sm font-normal text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                            <Skeleton className="h-4 w-4" />
                        </span>
                    </h3>
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}


export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<'status' | 'assignee'>('status');

  useEffect(() => {
    async function loadTasks() {
        setLoading(true);
        const fetchedTasks = await fetchTasks();
        
        // Map assigneeId to full assignee object
        const tasksWithAssignees = fetchedTasks.map(task => {
            if (task.assigneeId) {
                const assignee = teamMembers.find(m => m.id === task.assigneeId);
                return { ...task, assignee };
            }
            return task;
        });
        setTasks(tasksWithAssignees);
        setLoading(false);
    }
    loadTasks();
  }, []);

  const { columns, groupedTasks } = useMemo(() => {
    if (groupBy === 'assignee') {
      const grouped = teamMembers.reduce((acc, member) => {
        acc[member.name] = tasks.filter(task => task.assignee?.id === member.id);
        return acc;
      }, {} as Record<string, Task[]>);

      const unassigned = tasks.filter(task => !task.assignee);
      if (unassigned.length > 0) {
        grouped['Não Atribuído'] = unassigned;
      }
      
      const dynamicColumns = Object.keys(grouped).filter(name => grouped[name].length > 0).map(assigneeName => ({
        id: assigneeName,
        title: assigneeName,
      }));
      
      return { columns: dynamicColumns, groupedTasks: grouped };
    }
    
    // Default to groupBy status
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return { columns: statusColumns, groupedTasks: grouped };
  }, [tasks, groupBy]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Quadro de Tarefas</h2>
        <div className="flex items-center gap-2">
            <Select value={groupBy} onValueChange={(value) => setGroupBy(value as 'status' | 'assignee')}>
                <SelectTrigger className="w-[180px]">
                    <GripVertical className="mr-2 h-4 w-4"/>
                    <SelectValue placeholder="Agrupar por..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="assignee">Responsável</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filtrar
            </Button>
        </div>
      </div>
        {loading ? <TaskBoardPlaceholder /> : (
            <div className="grid flex-1 gap-6 items-start auto-rows-max md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {columns.map(column => (
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
        )}
    </div>
  );
}
