import { z } from "zod";

export const formSchema = z.object({
  brand: z.string().min(1, "Brand harus diisi"),
  cluster: z.string().min(1, "Cluster harus diisi"),
  fitur: z.string().min(1, "Fitur harus diisi"),
  nama_materi: z.string().min(1, "Nama materi harus diisi"),
  jenis: z.string().min(1, "Jenis harus diisi"),
  start_date: z.string().min(1, "Tanggal mulai harus diisi"),
  end_date: z.string().min(1, "Tanggal selesai harus diisi"),
  dokumenMateri: z
    .array(
      z.object({
        linkDokumen: z
          .string()
          .min(1, "Link dokumen harus diisi")
          .url("Link dokumen harus berupa URL valid"),
        tipeMateri: z.string().min(1, "Tipe materi harus diisi"),
        thumbnail: z
          .any()
          .refine(
            (val) =>
              val instanceof File ||
              (typeof val === "string" && val.length > 0),
            { message: "Thumbnail harus diupload" }
          ),
        keywords: z
          .array(z.string().min(1, "Keyword tidak boleh kosong"))
          .min(1, "Minimal 1 keyword harus diisi"),
      })
    )
    .min(1, "Minimal harus ada 1 dokumen materi"),
});

export type FormDataType = z.infer<typeof formSchema>;
