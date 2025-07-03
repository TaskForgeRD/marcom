import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onChange }) => {
  return (
    <div className="relative w-60">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        placeholder={placeholder}
        className="w-full pl-10 bg-white border border-gray-300"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
