// app/dashboard/components/stats-section/index.tsx - Updated with clear separation

"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import RealTimeStats from "./RealTimeStats";
import StatsChartCard from "./components/stats-chart-card";
import ToggleControls from "@/app/dashboard/uiRama/toggle-controls";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useMultiApiStore } from "@/stores/api.store";

export default function StatsSection() {
  const [showStatsSection, setShowStatsSection] = useState(true);
  const { onlyVisualDocs, setOnlyVisualDocs } = useFilterStore();
  const { fetchFitur } = useMultiApiStore();

  // Fetch fitur data on component mount
  useEffect(() => {
    fetchFitur();
  }, [fetchFitur]);

  // Visual docs toggle ONLY affects table data, NOT stats
  const handleVisualDocsToggle = (value: boolean) => {
    setOnlyVisualDocs(value);
    // Stats will continue to show unfiltered data
    console.log("Visual docs filter changed - affects table only, not stats");
  };

  return (
    <section>
      {/* Stats Cards Section - Always shows unfiltered data */}
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

      {/* Charts Section - Always shows unfiltered data */}
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

      {/* Toggle Controls - Make it clear this only affects table */}
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
