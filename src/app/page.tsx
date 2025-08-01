import { AppShell } from "@/components/app-shell";
import { TaskBoard } from "@/components/task-board";

export default function Home() {
  return (
    <AppShell>
      <TaskBoard />
    </AppShell>
  );
}
