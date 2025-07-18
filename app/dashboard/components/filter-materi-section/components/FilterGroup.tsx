// FilterGroup.tsx
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import SelectField from "../../../uiRama/selectField";
import { useMultiApiStore } from "@/stores/api.store";
import { FilterKey } from "../../../../../constants/filter-options";

type FilterGroupProps = {
  selectedFilters: Partial<Record<FilterKey, string>>;
  handleFilterChange: (key: FilterKey, value: string) => void;
  handleResetFilters: () => void;
  applyFilters: () => void;
};

const FilterGroup = ({
  selectedFilters,
  handleFilterChange,
  handleResetFilters,
  applyFilters,
}: FilterGroupProps) => {
  const { clusters, fitur, jenis } = useMultiApiStore();

  // Memoized filter options berdasarkan data dari API
  const filterOptions: Partial<Record<FilterKey, string[]>> = useMemo(() => {
    return {
      cluster: ["Semua Cluster", ...clusters.map((cluster) => cluster.name)],
      fitur: ["Semua Fitur", ...fitur.map((f) => f.name)],
      status: ["Semua Status", "Aktif", "Expired"],
      jenis: ["Semua Jenis", ...jenis.map((j) => j.name)],
    };
  }, [clusters, fitur, jenis]);

  // Filter keys untuk ditampilkan
  const filterKeys: FilterKey[] = ["cluster", "fitur", "status", "jenis"];

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
              // Jika pilih "Semua", simpan sebagai "Semua [Key]" bukan empty string
              if (value.startsWith("Semua") || value === "Semua Status") {
                handleFilterChange(key, value); // Simpan value asli "Semua Brand", dll
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
          className="text-black border border-black bg-transparent hover:bg-blue-600"
          onClick={applyFilters}
        >
          Terapkan
        </Button>
        <Button
          className="text-red-800 hover:text-red-600"
          variant="ghost"
          onClick={handleResetFilters}
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
};

export default FilterGroup;
