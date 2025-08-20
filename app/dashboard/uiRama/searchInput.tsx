// uiRama/searchInput.tsx - Updated to support controlled input
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string; // Tambahkan prop value untuk controlled input
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onChange,
  className = "w-60",
  value, // Destructure value prop
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        placeholder={placeholder}
        className="w-full pl-10 bg-white border border-gray-300"
        value={value} // Gunakan value prop untuk controlled input
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
