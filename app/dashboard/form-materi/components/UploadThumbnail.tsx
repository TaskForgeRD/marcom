import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Upload, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import get from "lodash.get";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    setValue,
    register,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

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

      setValue(name, file, { shouldValidate: true });
      trigger(name);
    }
  };

  const handleThumbnailClick = () => {
    if (readOnly && preview) {
      setIsDialogOpen(true);
    }
  };

  const error = get(errors, name);
  const errorMessage = typeof error?.message === "string" ? error.message : "";

  return (
    <>
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-4">
          {readOnly ? (
            <div
              className={`w-16 h-16 flex items-center justify-center border rounded-lg ${
                preview
                  ? "cursor-pointer hover:opacity-80 transition-opacity"
                  : ""
              } relative group`}
              onClick={handleThumbnailClick}
            >
              {preview ? (
                <>
                  <Image
                    width={64}
                    height={64}
                    src={preview}
                    alt="Thumbnail Preview"
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </>
              ) : (
                <Upload className="w-5 h-5 text-gray-500" />
              )}
            </div>
          ) : (
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
          )}

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

        {!readOnly && (
          <p className="text-xs text-gray-500">
            Maksimal 15MB. Format: JPG, PNG, GIF, WebP, BMP
          </p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none p-0 
    [&>button]:bg-red-500 
    [&>button]:hover:bg-red-600 
    [&>button]:text-white 
    [&>button]:rounded-md 
    [&>button]:w-12 
    [&>button]:h-12 
    [&>button]:flex 
    [&>button]:items-center 
    [&>button]:justify-center 
    [&>button_svg]:w-6 
    [&>button_svg]:h-6"
        >
          <DialogHeader className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"></DialogHeader>
          {preview && (
            <div className="flex items-center justify-center w-full h-full bg-black">
              <div className="relative w-full h-full">
                <Image
                  src={preview}
                  alt="Thumbnail Preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
          )}
          {value instanceof File && (
            <div className="px-4 pb-4 text-sm text-gray-600 text-center">
              <p>
                <strong>Nama file:</strong> {value.name}
              </p>
              <p>
                <strong>Ukuran:</strong> {(value.size / 1024 / 1024).toFixed(2)}
                MB
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
