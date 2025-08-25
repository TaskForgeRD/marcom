// components/stats-section/index.tsx - Updated to keep stats unfiltered

"use client";
import React from "react";
import { useState } from "react";
import RealTimeStats from "./RealTimeStats";
import StatsChartCard from "./components/stats-chart-card";
import ToggleControls from "@/app/dashboard/uiRama/toggle-controls";
import { useFilterStore } from "@/stores/filter-materi.store";

export default function StatsSection() {
  const [showStatsSection, setShowStatsSection] = useState(true);
  const { onlyVisualDocs, setOnlyVisualDocs } = useFilterStore();

  // CHANGED: Visual docs toggle now affects data display but NOT stats calculation
  const handleVisualDocsToggle = (value: boolean) => {
    console.log("Visual docs toggle changed:", value);
    setOnlyVisualDocs(value);
    // Note: This will affect the data table/list display, but NOT the stats
    // Stats will always show complete data regardless of this toggle
  };

  return (
    <section>
      <div
        className={`transition-all duration-300 ease-in-out ${
          showStatsSection ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          overflow: "hidden",
        }}
      >
        <RealTimeStats />
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          showStatsSection ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        }`}
        style={{
          overflow: "hidden",
        }}
      >
        <StatsChartCard />
      </div>
      <ToggleControls
        label="Lihat data yang ada dokumen visual saja"
        switchState={onlyVisualDocs}
        onToggleSwitch={handleVisualDocsToggle}
        togglePanelState={showStatsSection}
        onTogglePanel={() => setShowStatsSection((prev) => !prev)}
        togglePanelLabel={{
          show: "Sembunyikan Detail Summary",
          hide: "Lihat Detail Summary",
        }}
      />
    </section>
  );
}
