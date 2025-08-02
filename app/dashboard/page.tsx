import { DashboardShell } from "@/components/ui/dashboardShell";
import FilterDateSection from "@/app/dashboard/components/filter-date-section";
import StatsSection from "@/app/dashboard/components/stats-section";
import FilterMateriSection from "@/app/dashboard/components/filter-materi-section";
import MateriTabelSection from "@/app/dashboard/components/table-materi-section";

export default function DashboardPage() {
  return (
    <DashboardShell title="Dashboard">
      <FilterDateSection />
      <StatsSection />
      <FilterMateriSection />
      <MateriTabelSection />
    </DashboardShell>
  );
}
