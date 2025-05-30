export interface Materi {
  id: number;
  brandId: number;
  brand: string;
  clusterId: number;
  cluster: string;
  fitur: string;
  namaMateri: string;
  jenis: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  periode: string;
  created_at: string;
  updated_at: string;
  user_id: number;
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
  