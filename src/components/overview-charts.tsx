"use client";

import { Bar, BarChart, CartesianGrid, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell, PieChart as RechartsPieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { tasks } from '@/lib/mock-data';
import { useMemo } from 'react';

const COLORS = {
  todo: 'hsl(var(--chart-4))',
  inprogress: 'hsl(var(--chart-1))',
  done: 'hsl(var(--accent))',
};

const chartConfigStatus: ChartConfig = {
  tasks: {
    label: "Tasks",
  },
  todo: {
    label: "To Do",
    color: COLORS.todo,
  },
  inprogress: {
    label: "In Progress",
    color: COLORS.inprogress,
  },
  done: {
    label: "Done",
    color: COLORS.done,
  },
};

const chartConfigMembers: ChartConfig = {
    tasks: {
        label: "Tasks",
        color: "hsl(var(--chart-1))",
    }
}


export function OverviewCharts() {
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
  }, []);

  const memberData = useMemo(() => {
      const counts = tasks.reduce((acc, task) => {
          if(task.assignee){
            acc[task.assignee.name] = (acc[task.assignee.name] || 0) + 1;
          }
          return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(counts).map(([name, count]) => ({
          name: name.split(' ')[0], // Use first name for brevity
          tasks: count,
      }));
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
          <CardDescription>A breakdown of all tasks by their current status.</CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>Tasks per Team Member</CardTitle>
          <CardDescription>Total assigned tasks for each team member.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigMembers} className="min-h-[250px] w-full">
            <BarChart data={memberData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="tasks" fill="var(--color-tasks)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
