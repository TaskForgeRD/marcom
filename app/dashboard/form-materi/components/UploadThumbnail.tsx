import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

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
  const { setValue, watch } = useFormContext();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const value = watch(name);
  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string" && value !== ""
        ? getImageUrl(value)
        : null;

  const validateFile = (file: File): string | null => {
    // Validate file size (15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File terlalu besar. Maksimal 15MB, ukuran file: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    // Validate MIME type
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

    // Validate file extension
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
      setError("");

      // Frontend validation
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        e.target.value = ""; // Reset input
        return;
      }

      setThumbnail(file);
      setValue(name, file);
    }
  };

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
        <div className="flex flex-col">
          {thumbnail && (
            <div>
              <p className="text-sm font-medium">{thumbnail.name}</p>
              <p className="text-xs text-gray-500">
                {(thumbnail.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
          )}
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Maksimal 15MB. Format: JPG, PNG, GIF, WebP, BMP
      </p>
    </div>
  );
}
