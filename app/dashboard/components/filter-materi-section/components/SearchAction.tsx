import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/app/dashboard/uiRama/searchInput";
import ButtonWithIcon from "@/app/dashboard/uiRama/buttonWithIcon";
import { useMateri } from "@/stores/materi.store"; // 👈 Tambahkan ini
import { useRouter } from "next/navigation"; // 👈 Tambahkan ini

const SearchAndActions = ({
  handleResetFilters,
  applyFilters,
  setSearchQuery,
}: {
  handleTambahMateri: () => void;
  handleResetFilters: () => void;
  applyFilters: () => void;
  setSearchQuery: (query: string) => void;
}) => {
  const router = useRouter();
  const { setSelectedMateri } = useMateri();

  const handleTambahMateri = () => {
    setSelectedMateri(null); // 🧹 reset state sebelum pindah ke form tambah
    router.push("/dashboard/form-materi");
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div className="flex items-center space-x-4">
        <SearchInput
          placeholder="Cari Materi Komunikasi"
          onChange={setSearchQuery}
        />
        <ButtonWithIcon
          icon={PlusCircle}
          label="Tambah Materi Komunikasi"
          className="bg-black text-white"
          onClick={handleTambahMateri}
        />
      </div>
      <div className="flex space-x-2">
        <Button
          className="text-red-800 hover:text-red-600"
          variant="ghost"
          onClick={handleResetFilters}
        >
          Reset Filter
        </Button>
        <Button
          className="text-white bg-blue-500 hover:bg-blue-600"
          onClick={applyFilters}
        >
          Terapkan Filter
        </Button>
      </div>
    </div>
  );
};

export default SearchAndActions;
