"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { getImageUrl } from "@/lib/utils";

import { useRouter } from "next/navigation";

import { useMateriStore } from "../../../../../store/useMateriStore";
import { Key } from "react";

interface MateriRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  materi: any;
}

const MateriRow: React.FC<MateriRowProps> = ({ materi }) => {
  console.log(materi)
  const router = useRouter();
  const highlightedId = useMateriStore((state) => state.highlightedId);
  const setSelectedMateri = useMateriStore((state) => state.setSelectedMateri);

  const handleRowClick = () => {
    setSelectedMateri(materi); 
    router.push(`/dashboard/form-materi/${materi._id}?mode=view`);
  };

  return (
    <TableRow
      key={materi._id}
      onClick={() => handleRowClick()}
      className={`cursor-pointer ${
        materi._id === highlightedId ? "bg-green-100 transition-colors duration-500" : ""
      }`}
    >
      <TableCell>{materi.brand_name}</TableCell>
      <TableCell>{materi.cluster_name}</TableCell>
      <TableCell>{materi.fitur}</TableCell>
      <TableCell>{materi.nama_materi}</TableCell>

      <TableCell>
        <div className="flex flex-col gap-2">
          {materi.dokumenMateri && materi.dokumenMateri.map((dokumen: { _id: Key | null | undefined; thumbnail: string | undefined; linkDokumen: string | undefined; }, index: number) => (
            <div key={index} className="flex items-center gap-2">
              {dokumen.thumbnail && (
                console.log(dokumen.thumbnail),
                <Image
                  alt={materi.nama_materi}
                  src={getImageUrl(dokumen.thumbnail)}
                  width={50}
                  height={50}
                  unoptimized
                  className="w-12 h-12 object-cover rounded-md"
                />
              )}
              <Button variant="link" asChild className="text-blue-600 underline">
                <a href={dokumen.linkDokumen} target="_blank" rel="noopener noreferrer">
                  Lihat Materi {index + 1}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </TableCell>

      <TableCell>{materi.dokumenMateri[0]?.tipeMateri}</TableCell>

      <TableCell>
        <StatusBadge startDate={materi.start_date} endDate={materi.end_date} />
      </TableCell>

      <TableCell>{materi.jenis}</TableCell>

      <TableCell>
        {format(new Date(materi.start_date), "yyyy-MM-dd")} - {format(new Date(materi.end_date), "yyyy-MM-dd")}
      </TableCell>

      <TableCell>
        {Array.isArray(materi.dokumenMateri)
          ? materi.dokumenMateri
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .flatMap((dokumen: { keywords: any; }) => dokumen.keywords || [])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((keyword: any) => keyword) 
              .join(", ")
          : "-"}
      </TableCell>
    </TableRow>
  );
};

export default MateriRow;
