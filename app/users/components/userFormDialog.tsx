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
import { User, Role } from "@/stores/user.store";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: {
    email: string;
    name: string;
    role: Role;
  }) => Promise<void>;
  user?: User | null;
  currentUserRole: Role;
}

export default function UserFormDialog({
  open,
  onClose,
  onSave,
  user,
  currentUserRole,
}: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "guest" as Role,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          email: user.email,
          name: user.name,
          role: user.role || "guest",
        });
      } else {
        setFormData({
          email: "",
          name: "",
          role: "guest",
        });
      }
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.name.trim()) {
      toast({
        title: "Validasi Error",
        description: "Email dan nama harus diisi",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validasi Error",
        description: "Format email tidak valid",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);

      toast({
        title: "Berhasil",
        description: `Pengguna berhasil ${user ? "diperbarui" : "ditambahkan"}`,
        className: "bg-green-100 text-green-800",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Gagal",
        description:
          error.message ||
          `Gagal ${user ? "memperbarui" : "menambahkan"} pengguna`,
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
          <DialogTitle>
            {user ? "Edit Pengguna" : "Tambah Pengguna Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="user@example.com"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nama Lengkap"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as Role })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
              {currentUserRole === "superadmin" && (
                <option value="superadmin">Super Admin</option>
              )}
            </select>
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
            <Button
              type="submit"
              disabled={
                isLoading || !formData.email.trim() || !formData.name.trim()
              }
            >
              {isLoading ? "Menyimpan..." : user ? "Perbarui" : "Buat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
