"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreateEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  title: string;
  entityName: string;
  initialValue?: string;
}

export default function CreateEditDialog({
  open,
  onClose,
  onSave,
  title,
  entityName,
  initialValue = "",
}: CreateEditDialogProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName(initialValue);
    }
  }, [open, initialValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Validasi Error",
        description: `Nama ${entityName} harus diisi`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(name.trim());
      toast({
        title: "Berhasil",
        description: `${entityName} berhasil ${initialValue ? "diperbarui" : "ditambahkan"}`,
        className: "bg-green-100 text-green-800",
      });
      setName("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Gagal ${initialValue ? "memperbarui" : "menambahkan"} ${entityName}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama {entityName}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Masukkan nama ${entityName.toLowerCase()}`}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
