import FilterOption from "./components/filters/filterOption/filterOption";
import FilterDate from "./components/filters/filterDate/filterDate";
import MateriTabel from "./components/table/MateriTable";
import StatsSection from "./components/StatsSection/";

export default function Page() {
  return (
    <main className="min-h-screen w-full max-w-full">
      <FilterDate />
      <StatsSection />

      <section>
        <FilterOption />
        <MateriTabel />
      </section>
    </main>
  );
}
