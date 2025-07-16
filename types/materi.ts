export interface Materi {
  id: number;
  user_id: number;
  brand_id: number;
  brand: string;
  brand_name: string;
  cluster_id: number;
  cluster: string;
  cluster_name: string;
  fitur_id: number;
  fitur: string;
  fitur_name: string;
  nama_materi: string;
  jenis_id: number;
  jenis: string;
  jenis_name: string;
  start_date: string; // ← Ubah dari start_date ke start_date
  end_date: string; // ← Ubah dari end_date ke end_date
  periode: string;
  created_at: string;
  updated_at: string;
  dokumenMateri?: {
    // ← Ubah dari dokumenMateri ke dokumenMateri
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
  setSelectedMateri: (materi: Materi | null) => void;
}
