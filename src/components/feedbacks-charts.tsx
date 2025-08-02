"use client";

import { subDays, parseISO, isAfter, isBefore } from "date-fns";
import type { Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Bar } from "recharts";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";

interface FeedbacksChartsProps {
  tasks: Task[];
}

export function FeedbacksCharts({ tasks }: FeedbacksChartsProps) {
  const now = new Date();
  const oneWeekAgo = subDays(now, 7);

  const weeklyTasks = tasks.filter(task => {
    if (task.status !== 'done') return false;
    const completionDate = task.completionDate ? parseISO(task.completionDate) : null;
    return completionDate && isAfter(completionDate, oneWeekAgo) && isBefore(completionDate, now);
  });

  const tasksDoneOnTime = weeklyTasks.filter(task => {
      const deadline = parseISO(task.deadline);
      const completionDate = task.completionDate ? parseISO(task.completionDate) : new Date();
      return isBefore(completionDate, deadline) || completionDate.getTime() === deadline.getTime();
  }).length;
  
  const tasksDoneLate = weeklyTasks.length - tasksDoneOnTime;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const overdueTasks = tasks.filter(t => t.status !== 'done' && isAfter(now, parseISO(t.deadline))).length;
  const onTimeCompletionRate = completedTasks > 0 ? (tasks.filter(t => t.status === 'done' && t.completionDate && isBefore(parseISO(t.completionDate), parseISO(t.deadline))).length / completedTasks) * 100 : 0;


  const statusData = [
    { name: 'A Fazer', value: tasks.filter(t => t.status === 'todo').length, fill: "hsl(var(--chart-1))" },
    { name: 'Em Progresso', value: tasks.filter(t => t.status === 'inprogress').length, fill: "hsl(var(--chart-2))" },
    { name: 'Concluídas', value: completedTasks, fill: "hsl(var(--chart-3))" },
  ];

  const weeklyPerformanceData = [
      { name: 'No Prazo', value: tasksDoneOnTime, fill: 'hsl(var(--chart-2))' },
      { name: 'Com Atraso', value: tasksDoneLate, fill: 'hsl(var(--chart-5))' },
  ];


  return (
    <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Feedbacks de Desempenho</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedTasks}</div>
                    <p className="text-xs text-muted-foreground">de {totalTasks} tarefas no total</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conclusão no Prazo</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{onTimeCompletionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">das tarefas concluídas</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overdueTasks}</div>
                    <p className="text-xs text-muted-foreground">Não concluídas após o prazo</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Concluídas na Semana</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{weeklyTasks.length}</div>
                    <p className="text-xs text-muted-foreground">Nos últimos 7 dias</p>
                </CardContent>
            </Card>
        </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral das Tarefas</CardTitle>
                    <CardDescription>Distribuição de tarefas por status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="min-h-[250px] w-full">
                       <ResponsiveContainer width="100%" height={250}>
                            <RechartsPieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Desempenho da Última Semana</CardTitle>
                    <CardDescription>Tarefas concluídas nos últimos 7 dias.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="min-h-[250px] w-full">
                        <ResponsiveContainer width="100%" height={250}>
                           <BarChart data={weeklyPerformanceData} layout="vertical" margin={{ left: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent hideLabel />} />
                                <Legend />
                                <Bar dataKey="value" name="Tarefas" fill="var(--color-value)" radius={4}>
                                   {weeklyPerformanceData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
