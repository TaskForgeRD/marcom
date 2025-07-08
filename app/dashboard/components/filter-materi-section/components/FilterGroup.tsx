// FilterGroup.tsx
import { useMemo } from "react";
import SelectField from "../../../uiRama/selectField";
import { useMultiApiStore } from "@/stores/api.store";
import { FilterKey } from "../../../../../constants/filter-options";

type FilterGroupProps = {
  selectedFilters: Partial<Record<FilterKey, string>>;
  handleFilterChange: (key: FilterKey, value: string) => void;
};

const FilterGroup = ({
  selectedFilters,
  handleFilterChange,
}: FilterGroupProps) => {
  const { brands, clusters, fitur, jenis } = useMultiApiStore();

  // Memoized filter options berdasarkan data dari API
  const filterOptions = useMemo(() => {
    return {
      brand: ["Semua Brand", ...brands.map((brand) => brand.name)],
      cluster: ["Semua Cluster", ...clusters.map((cluster) => cluster.name)],
      fitur: ["Semua Fitur", ...fitur.map((f) => f.name)],
      status: ["Semua Status", "Aktif", "Expired"],
      jenis: ["Semua Jenis", ...jenis.map((j) => j.name)],
    };
  }, [brands, clusters, fitur, jenis]);

  console.log(filterOptions);

  // Filter keys untuk ditampilkan
  const filterKeys: FilterKey[] = [
    "brand",
    "cluster",
    "fitur",
    "status",
    "jenis",
  ];

  console.log(filterOptions);

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">Filter</span>
      <div className="grid grid-cols-5 gap-2 w-full">
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
            options={filterOptions[key].map((opt) => ({
              value: opt,
              label: opt,
            }))}
            showLabel={false}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
