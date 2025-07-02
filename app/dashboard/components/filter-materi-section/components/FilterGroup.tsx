// FilterGroup.tsx
import { useMemo } from "react";
import SelectField from "../../../uiRama/selectField";
import { useMultiApiStore } from "@/stores/api.store";
import { FilterKey } from "../../../../../constants/filter-options";

type FilterGroupProps = {
  selectedFilters: Partial<Record<FilterKey, string>>;
  handleFilterChange: (key: FilterKey, value: string) => void;
};

const FilterGroup = ({ selectedFilters, handleFilterChange }: FilterGroupProps) => {
  const { brands, clusters, fitur, jenis } = useMultiApiStore();

  // Memoized filter options berdasarkan data dari API
  const filterOptions = useMemo(() => {
    return {
      brand: brands.map(brand => brand.name),
      cluster: clusters.map(cluster => cluster.name),
      fitur: fitur.map(f => f.name),
      status: ["Aktif", "Expired"],
      jenis: jenis.map(j => j.name), 
    };
  }, [brands, clusters, fitur, jenis]);

  console.log(filterOptions)

  // Filter keys untuk ditampilkan
  const filterKeys: FilterKey[] = ["brand", "cluster", "fitur", "status", "jenis"];

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">Filter</span>
      <div className="grid grid-cols-5 gap-2 w-full">
        {filterKeys.map((key) => (
          <SelectField
            key={key}
            label={key}
            value={selectedFilters[key] || ""}
            onChange={(value) => handleFilterChange(key, value)}
            options={filterOptions[key].map((opt) => ({ value: opt, label: opt }))}
            showLabel={false}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;