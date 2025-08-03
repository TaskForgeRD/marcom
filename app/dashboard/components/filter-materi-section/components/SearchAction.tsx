import SearchInput from "@/app/dashboard/uiRama/searchInput";

const SearchAndActions = ({
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <div className="flex items-center w-full">
      <div className="flex-1 min-w-0 max-w-[600px]">
        <SearchInput
          placeholder="Cari Materi Komunikasi"
          onChange={setSearchQuery}
          className="w-126" // atau "w-full max-w-lg"
        />
      </div>
    </div>
  );
};

export default SearchAndActions;
