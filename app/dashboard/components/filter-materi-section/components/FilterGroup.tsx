import SelectField from "../../../uiRama/selectField";
import { filterOptions, FilterKey } from "../../../../../constants/filter-options";

type FilterGroupProps = {
  selectedFilters: Partial<Record<FilterKey, string>>;
  handleFilterChange: (key: FilterKey, value: string) => void;
};

const FilterGroup = ({ selectedFilters, handleFilterChange }: FilterGroupProps) => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">Filter</span>
      <div className="grid grid-cols-5 gap-2 w-full">
        {Object.entries(filterOptions).map(([key, options]) => (
          <SelectField
            key={key}
            label={key}
            value={selectedFilters[key as FilterKey] || ""}
            onChange={(value) => handleFilterChange(key as FilterKey, value)}
            options={options.map((opt) => ({ value: opt, label: opt }))}
            showLabel={false}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
