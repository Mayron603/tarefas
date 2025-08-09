import { AppShell } from "@/components/app-shell";
import { TaskBoard } from "@/components/task-board";
import { fetchTasks } from "@/app/actions";
import { getUserData } from "@/app/actions";
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export default async function DailyTasksPage({ params }: { params: { date: string } }) {
  const user = await getUserData();
  const allTasks = await fetchTasks();
  
  const selectedDate = parseISO(params.date);
  const startOfSelectedDay = startOfDay(selectedDate);
  const endOfSelectedDay = endOfDay(selectedDate);

  const filteredTasks = allTasks.filter(task => {
    const taskDeadline = parseISO(task.deadline);
    return taskDeadline >= startOfSelectedDay && taskDeadline <= endOfSelectedDay;
  });

  return (
    <AppShell user={user}>
      <TaskBoard initialTasks={filteredTasks} />
    </AppShell>
  );
}
