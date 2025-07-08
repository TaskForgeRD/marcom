import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import get from "lodash.get";

import { toast } from "@/hooks/use-toast";

interface UploadThumbnailProps {
  name: string;
  label?: string;
  readOnly?: boolean;
}

export default function UploadThumbnail({
  name,
  label = "Upload Thumbnail",
  readOnly = false,
}: UploadThumbnailProps) {
  const {
    setValue,
    register,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  // Daftarkan field secara manual karena input type="file" disembunyikan
  useEffect(() => {
    register(name);
  }, [register, name]);

  const value = watch(name);

  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string" && value !== ""
        ? getImageUrl(value)
        : null;

  const validateFile = (file: File): string | null => {
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File terlalu besar. Maksimal 15MB, ukuran file: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
    ];
    if (!validTypes.includes(file.type)) {
      return `Tipe file tidak valid. Hanya menerima: JPG, PNG, GIF, WebP, BMP`;
    }

    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return `Ekstensi file tidak valid. Hanya menerima: ${allowedExtensions.join(", ")}`;
    }

    return null;
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: "Upload gagal",
          description: validationError,
          variant: "destructive",
          className: "bg-red-100 text-red-800",
        });
        return;
      }

      // Set file dan validasi ke react-hook-form
      setValue(name, file, { shouldValidate: true });
      trigger(name);
    }
  };

  const error = get(errors, name);
  const errorMessage = typeof error?.message === "string" ? error.message : "";

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
            className="hidden"
            onChange={handleThumbnailChange}
            disabled={readOnly}
          />
          <Card className="w-16 h-16 flex items-center justify-center border rounded-lg hover:bg-gray-100">
            {preview ? (
              <Image
                width={64}
                height={64}
                src={preview}
                alt="Thumbnail Preview"
                unoptimized
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Upload className="w-5 h-5 text-gray-500" />
            )}
          </Card>
        </label>
        {value instanceof File && (
          <div className="flex flex-col">
            <p className="text-sm font-medium">{value.name}</p>
            <p className="text-xs text-gray-500">
              {(value.size / 1024 / 1024).toFixed(2)}MB
            </p>
          </div>
        )}
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      <p className="text-xs text-gray-500">
        Maksimal 15MB. Format: JPG, PNG, GIF, WebP, BMP
      </p>
    </div>
  );
}
