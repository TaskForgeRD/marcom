export interface Materi {
  _id: string;
  brand: string;
  cluster: string;
  fitur: string;
  namaMateri: string;
  jenis: string;
  startDate: string;
  endDate: string;
  periode: string;
  dokumenMateri: {
    linkDokumen: string;
    thumbnail: string;
    keywords: string[];
    tipeMateri: string;
  }[];
}
  
export interface MateriStore {
  data: Materi[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  highlightedId: string | null;
  fetchData: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  viewMateri: (id: string) => void;
  selectedMateri: Materi | null;
  setSelectedMateri: (materi: Materi) => void;
}
  