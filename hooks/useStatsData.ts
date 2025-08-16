import { useMemo } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useMateri } from "@/stores/materi.store";
import { formatPresetLabel } from "@/lib/utils/dateUtils";
import { formatChange } from "@/lib/utils/statsUtils";

export const useStatsData = () => {
  const { selectedPreset, filters, applyFilters, setTempFilter } =
    useFilterStore();
  const { stats, fetchWithStats } = useMateri();

  const dateRange =
    filters?.start_date && filters?.end_date
      ? {
          from: new Date(filters.start_date),
          to: new Date(filters.end_date),
        }
      : undefined;

  const waktuLabel = formatPresetLabel(selectedPreset, dateRange);

  const refreshStats = async () => {
    const apiFilters = {
      search: filters.search || "",
      status: filters.status || "",
      brand: filters.brand || "",
      cluster: filters.cluster || "",
      fitur: filters.fitur || "",
      jenis: filters.jenis || "",
      start_date: filters.start_date || "",
      end_date: filters.end_date || "",
      only_visual_docs: filters.only_visual_docs?.toString() || "false",
    };

    await fetchWithStats(1, apiFilters);
  };

  const formattedStats = useMemo(() => {
    if (!stats) return {};

    return {
      total: { now: stats.total || 0, changeLabel: formatChange(0) },
      fitur: { now: stats.fitur || 0, changeLabel: formatChange(0) },
      komunikasi: { now: stats.komunikasi || 0, changeLabel: formatChange(0) },
      aktif: { now: stats.aktif || 0, changeLabel: formatChange(0) },
      expired: { now: stats.expired || 0, changeLabel: formatChange(0) },
      dokumen: { now: stats.dokumen || 0, changeLabel: formatChange(0) },
    };
  }, [stats]);

  return {
    selectedPreset,
    waktuLabel,
    loading: false,
    error: null,
    applyFilters,
    setTempFilter,
    filters,
    lastUpdated: new Date().toISOString(),
    refreshStats,
    stats: formattedStats,
  };
};
