import { AppShell } from "@/components/app-shell";
import { TaskBoard } from "@/components/task-board";
import { fetchTasks } from "@/app/actions";
import { getUserData } from "@/app/actions";

export default async function Home() {
  const tasks = await fetchTasks();
  const user = await getUserData();

  return (
    <AppShell user={user}>
      <TaskBoard initialTasks={tasks} />
    </AppShell>
  );
}
