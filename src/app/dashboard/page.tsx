import { AppShell } from "@/components/app-shell";
import { OverviewCharts } from "@/components/overview-charts";
import { Button } from "@/components/ui/button";
import { AiSuggestionModal } from "@/components/ai-suggestion-modal";
import { useToast } from "@/hooks/use-toast";

function ReportsPlaceholder() {
    "use client"
    const { toast } = useToast();
    return (
        <Button onClick={() => toast({ title: "Coming Soon!", description: "Report generation will be available soon."})}>
            Generate Report
        </Button>
    )
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Dashboard</h2>
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
