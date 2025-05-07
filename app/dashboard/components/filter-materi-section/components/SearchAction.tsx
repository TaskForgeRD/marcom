import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/app/dashboard/uiRama/searchInput";
import ButtonWithIcon from "@/app/dashboard/uiRama/buttonWithIcon";

const SearchAndActions = ({
    handleTambahMateri,
    handleResetFilters,
    applyFilters,
    setSearchQuery,
  }: {
    handleTambahMateri: () => void;
    handleResetFilters: () => void;
    applyFilters: () => void;
    setSearchQuery: (query: string) => void;
  }) => {  
    return (
        <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-4">
          <SearchInput placeholder="Cari Materi Komunikasi" onChange={setSearchQuery} />
          <ButtonWithIcon
            icon={PlusCircle}
            label="Tambah Materi Komunikasi"
            className="bg-black text-white"
            onClick={handleTambahMateri}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={handleResetFilters}>
            Reset Filter
          </Button>
          <Button className="text-white bg-blue-500 hover:bg-blue-600" onClick={applyFilters}>
            Terapkan Filter
          </Button>
        </div>
        </div>
    );
};

export default SearchAndActions;
