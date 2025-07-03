import FilterMateriSection from "./components/filter-materi-section";
import FilterDateSection from "@/app/dashboard/components/filter-date-section";
import MateriTabelSection from "./components/table-materi-section";
import StatsSection from "./components/stats-section";

export default function Page() {
  const unused = 123;

  console.log("test");

  return (
    <main className="min-h-screen w-full max-w-full">
      <FilterDateSection />
      <StatsSection />
      <FilterMateriSection />
      <MateriTabelSection />
    </main>
  );
}
