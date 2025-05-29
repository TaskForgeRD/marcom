export interface Materi {
  id: number;
  brand_id: number;
  brand_name: string;
  cluster_id: number;
  cluster_name: string;
  fitur: string;
  nama_materi: string;
  jenis: string;
  start_date: string; // ISO string
  end_date: string;   // ISO string
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
  