interface TableColumnConfig {
  key: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (item: any) => React.ReactNode;
}

export const materiTableColumns: TableColumnConfig[] = [
  { key: "brand", header: "Brand" },
  { key: "cluster", header: "Cluster" },
  { key: "fitur", header: "Fitur" },
  { key: "komunikasi", header: "Materi Komunikasi" },
  { key: "dokumen", header: "Dokumen" },
  { key: "tipe", header: "Tipe" },
  { key: "status", header: "Status" },
  { key: "jenis", header: "Jenis" },
  { key: "periode", header: "Periode" },
  { key: "keywords", header: "Keywords" },
];
