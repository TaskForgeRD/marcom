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
      {showStatsSection ? <RealTimeStats /> : <StatsChartCard />}
      <Collapsible
        open={showStatsSection}
        onOpenChange={() => setShowStatsSection((prev) => !prev)}
        className="flex w-[350px] flex-col gap-2"
      >
        <CollapsibleTrigger asChild>
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
        </CollapsibleTrigger>

        <CollapsibleContent
          style={{ transitionDuration: "0.3s" }}
          className="flex flex-col gap-2"
        >
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
