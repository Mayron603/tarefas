"use client";

import { Bar, BarChart, CartesianGrid, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell, PieChart as RechartsPieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { teamMembers } from '@/lib/team';
import { Task } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { fetchTasks } from '@/app/actions';

const COLORS = {
  todo: 'hsl(var(--chart-4))',
  inprogress: 'hsl(var(--chart-1))',
  done: 'hsl(var(--accent))',
};

const chartConfigStatus: ChartConfig = {
  tasks: {
    label: "Tarefas",
  },
  todo: {
    label: "A Fazer",
    color: COLORS.todo,
  },
  inprogress: {
    label: "Em Progresso",
    color: COLORS.inprogress,
  },
  done: {
    label: "Concluído",
    color: COLORS.done,
  },
};

const chartConfigMembers: ChartConfig = {
    tasks: {
        label: "Tarefas",
        color: "hsl(var(--chart-1))",
    }
}


export function OverviewCharts() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function loadTasks() {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
    }
    loadTasks();
  }, []);

  const statusData = useMemo(() => {
    const counts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return [
      { status: 'todo', count: counts.todo || 0, fill: COLORS.todo },
      { status: 'inprogress', count: counts.inprogress || 0, fill: COLORS.inprogress },
      { status: 'done', count: counts.done || 0, fill: COLORS.done },
    ];
  }, [tasks]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tarefas por Status</CardTitle>
          <CardDescription>Uma divisão de todas as tarefas por seu status atual.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigStatus} className="min-h-[250px] w-full">
            <RechartsPieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={60} outerRadius={80} strokeWidth={2}>
                  {statusData.map((entry) => <Cell key={`cell-${entry.status}`} fill={entry.fill} className="focus:outline-none" />)}
              </Pie>
              <Legend content={({ payload }) => {
                  return (
                      <ul className="flex justify-center gap-4 mt-4">
                          {payload?.map((entry, index) => (
                              <li key={`item-${index}`} className="flex items-center gap-2 text-sm">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: entry.color}}/>
                                  <span>{chartConfigStatus[entry.value as keyof typeof chartConfigStatus]?.label}</span>
                              </li>
                          ))}
                      </ul>
                  )
              }}/>
            </RechartsPieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
