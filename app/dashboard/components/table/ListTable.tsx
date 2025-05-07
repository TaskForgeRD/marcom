"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MateriRow from "./MateriRow";

interface ReusableTableProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

const ListTable: React.FC<ReusableTableProps> = ({ title, data }) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Fitur</TableHead>
            <TableHead>Materi Komunikasi</TableHead>
            <TableHead>Dokumen</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Keywords</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((materi) => <MateriRow key={materi._id} materi={materi} />)
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500 py-4">
                Tidak ada data yang cocok dengan filter
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListTable;
