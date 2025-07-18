// components/stats-section/index.tsx - Updated to use RealTimeStats

"use client";
import React from "react";
import { useState } from "react";
import RealTimeStats from "./RealTimeStats";
import StatsChartCard from "./components/stats-chart-card";
import ToggleControls from "@/app/dashboard/uiRama/toggle-controls";
import { useFilterStore } from "@/stores/filter-materi.store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function StatsSection() {
  const [showStatsSection, setShowStatsSection] = useState(true);
  const { onlyVisualDocs, setOnlyVisualDocs } = useFilterStore();

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
        onToggleSwitch={setOnlyVisualDocs}
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
