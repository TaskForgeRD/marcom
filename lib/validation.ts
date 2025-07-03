// lib/validation.ts
import { z } from "zod";

export const formSchema = z.object({
  brand: z.string().min(1, "Brand harus diisi"),
  cluster: z.string().min(1, "Cluster harus diisi"),
  fitur: z.string().min(1, "Fitur harus diisi"),
  nama_materi: z.string().min(1, "Nama materi harus diisi"),
  jenis: z.string().min(1, "Jenis harus diisi"),
  start_date: z.string().min(1, "Tanggal mulai harus diisi"),
  end_date: z.string().min(1, "Tanggal selesai harus diisi"),
  dokumenMateri: z.array(
    z.object({
      linkDokumen: z.string().min(1, "Link dokumen harus diisi"),
      tipeMateri: z.string().min(1, "Tipe materi harus diisi"),
      // Ubah validasi thumbnail untuk menangani File object dan string
      thumbnail: z
        .union([
          z.string(), // untuk URL string
          z.instanceof(File), // untuk File object dari upload
          z.null(), // untuk nilai kosong
          z.undefined(), // untuk nilai undefined
        ])
        .optional(),
      keywords: z.array(z.string()),
    })
  ),
});

export type FormDataType = z.infer<typeof formSchema>;
