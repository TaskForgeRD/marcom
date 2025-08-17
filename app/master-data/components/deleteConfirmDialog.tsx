"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  entityName: string;
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  itemName,
  entityName,
}: DeleteConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast({
        title: "Berhasil",
        description: `${entityName} "${itemName}" berhasil dihapus`,
        className: "bg-green-100 text-green-800",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Gagal menghapus ${entityName}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Konfirmasi Hapus
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus {entityName}{" "}
            <strong>"{itemName}"</strong>?
            <br />
            <span className="text-red-600 text-sm mt-2 block">
              ⚠️ Data yang sudah dihapus tidak dapat dikembalikan
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
