import { AppShell } from "@/components/app-shell";
import { TaskBoard } from "@/components/task-board";
import { fetchTasks } from "@/app/actions";

export default async function Home() {
  const tasks = await fetchTasks();

  return (
    <AppShell>
      <TaskBoard initialTasks={tasks} />
    </AppShell>
  );
}