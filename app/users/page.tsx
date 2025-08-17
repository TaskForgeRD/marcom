"use client";

import React, { useState, useEffect } from "react";
import { Database, Shield } from "lucide-react";
import { DashboardShell } from "@/components/ui/dashboardShell";
import { useAuth } from "@/hooks/use-auth.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserTable from "@/app/users/components/userTable";
import UserFormDialog from "@/app/users/components/userFormDialog";
import DeleteConfirmDialog from "@/app/master-data/components/deleteConfirmDialog";
import { useUserStore, User, Role } from "@/stores/user.store";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } =
    useUserStore();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const currentUserRole: Role = currentUser?.role as Role;

  useEffect(() => {
    if (currentUserRole === "superadmin") {
      fetchUsers();
    }
  }, [fetchUsers, currentUserRole]);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (userData: {
    email: string;
    name: string;
    role: Role;
  }) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, userData);
    } else {
      await createUser(userData);
    }
    setIsFormDialogOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (currentUserRole !== "superadmin") {
    return (
      <DashboardShell title="User Management">
        <div className="p-6">
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Akses Ditolak
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Anda tidak memiliki izin untuk mengakses halaman ini
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (loading) {
    return (
      <DashboardShell title="User Management">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="User Management">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Pengguna
            </h1>
            <p className="text-sm text-gray-600">
              Kelola pengguna dan peran mereka
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable
              users={users}
              currentUserRole={currentUserRole}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />
          </CardContent>
        </Card>

        <UserFormDialog
          open={isFormDialogOpen}
          onClose={() => {
            setIsFormDialogOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSave}
          user={selectedUser}
          currentUserRole={currentUserRole}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={selectedUser?.name || ""}
          entityName="pengguna"
        />
      </div>
    </DashboardShell>
  );
}
