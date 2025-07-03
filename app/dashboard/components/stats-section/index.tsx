// components/stats-section/index.tsx - Updated to use RealTimeStats

"use client"
import React from "react";
import { useState } from "react";
import RealTimeStats from "./RealTimeStats";
import StatsChartCard from "./components/stats-chart-card";
import ToggleControls from "@/app/dashboard/uiRama/toggle-controls";

export default function StatsSection() {
  const [onlyVisualDocs, setOnlyVisualDocs] = useState(false);
  const [showStatsSection, setShowStatsSection] = useState(true);

  return (
    <section>
      {showStatsSection ? <RealTimeStats /> : <StatsChartCard />}
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