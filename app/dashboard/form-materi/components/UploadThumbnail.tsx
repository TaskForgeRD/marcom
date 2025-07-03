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

  const value = watch(name);
  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string" && value !== ""
        ? getImageUrl(value)
        : null;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const file = e.target.files?.[0];
    if (file) {
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
            accept="image/*"
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
        {thumbnail && <p className="text-sm">{thumbnail.name}</p>}
      </div>
    </div>
  );
}
