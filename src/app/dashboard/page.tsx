import { AppShell } from "@/components/app-shell";
import { OverviewCharts } from "@/components/overview-charts";
import { AiSuggestionModal } from "@/components/ai-suggestion-modal";
import { ReportsPlaceholder } from "@/components/reports-placeholder";


export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Painel</h2>
            <div className="flex items-center gap-2">
                <AiSuggestionModal />
                <ReportsPlaceholder />
            </div>
        </div>
        <OverviewCharts />
      </div>
    </AppShell>
  );
}
