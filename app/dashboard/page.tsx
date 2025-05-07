"use client";

import { useState } from "react";

import FilterOption from "./components/filters/filterOption/filterOption";
import FilterDate from "./components/filters/filterDate/filterDate";
import MateriTabel from "./components/table/MateriTable";
import StatsSection from "./components/StatsSection/";
import ToggleControls from "@/app/dashboard/uiRama/toggle-controls";

export default function Page() {
  const [onlyVisualDocs, setOnlyVisualDocs] = useState(false);
  const [showStatsSection, setShowStatsSection] = useState(true);

  return (
    <main className="min-h-screen w-full max-w-full">
      <FilterDate />

      {showStatsSection && <StatsSection />}

      <ToggleControls
        label="Lihat data yang ada dokumen visual saja"
        switchState={onlyVisualDocs}
        onToggleSwitch={setOnlyVisualDocs}
        togglePanelState={showStatsSection}
        onTogglePanel={() => setShowStatsSection((prev) => !prev)}
        togglePanelLabel={{
          show: "Lihat Detail Summary",
          hide: "Sembunyikan Detail Summary",
        }}
      />

      <section>
        <FilterOption />
        <MateriTabel />
      </section>
    </main>
  );
}
