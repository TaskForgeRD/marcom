import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import SelectField from "../../../uiRama/selectField";
import { useMultiApiStore } from "@/stores/api.store";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "@/stores/filter-materi.store";
import { FilterKey } from "../../../../../constants/filter-options";

type FilterGroupProps = {
  selectedFilters: Partial<Record<FilterKey, string>>;
  handleFilterChange: (key: FilterKey, value: string) => void;
  handleResetFilters: () => void;
  applyFilters?: () => Record<string, any>;
};

const FilterGroup = ({
  selectedFilters,
  handleFilterChange,
  handleResetFilters,
}: FilterGroupProps) => {
  const { clusters, fitur, jenis } = useMultiApiStore();
  const { fetchData } = useMateri();
  const { applyFilters, resetFilters } = useFilterStore();

  const filterOptions: Partial<Record<FilterKey, string[]>> = useMemo(() => {
    return {
      cluster: ["Semua Cluster", ...clusters.map((cluster) => cluster.name)],
      fitur: ["Semua Fitur", ...fitur.map((f) => f.name)],
      status: ["Semua Status", "Aktif", "Expired"],
      jenis: ["Semua Jenis", ...jenis.map((j) => j.name)],
    };
  }, [clusters, fitur, jenis]);

  const filterKeys: FilterKey[] = ["cluster", "fitur", "status", "jenis"];

  const handleApplyFilters = async () => {
    const newFilters = applyFilters();
    await fetchData(1, newFilters);
  };

  const handleResetFiltersClick = async () => {
    handleResetFilters();
    const emptyFilters = resetFilters();
    await fetchData(1, emptyFilters);
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">Filter</span>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {filterKeys.map((key) => (
          <SelectField
            key={key}
            label={key}
            value={selectedFilters[key] || ""}
            onChange={(value) => {
              if (value.startsWith("Semua") || value === "Semua Status") {
                handleFilterChange(key, value);
              } else {
                handleFilterChange(key, value);
              }
            }}
            options={
              filterOptions[key]?.map((opt) => ({
                value: opt,
                label: opt,
              })) || []
            }
            showLabel={false}
          />
        ))}
      </div>
      <div className="flex space-x-2 ml-auto">
        <Button
          className="text-black hover:text-black border border-black bg-transparent hover:bg-gray-200"
          onClick={handleApplyFilters}
        >
          Terapkan
        </Button>
        <Button
          className="text-red-800 hover:text-red-600"
          variant="ghost"
          onClick={handleResetFiltersClick}
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
};

export default FilterGroup;
