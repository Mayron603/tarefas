import { AppShell } from "@/components/app-shell";
import { getUserData, fetchTasks } from "@/app/actions";
import { FeedbacksCharts } from "@/components/feedbacks-charts";

export default async function FeedbacksPage() {
  const user = await getUserData();
  const tasks = await fetchTasks();

  return (
    <AppShell user={user}>
      <FeedbacksCharts tasks={tasks} />
    </AppShell>
  );
}
