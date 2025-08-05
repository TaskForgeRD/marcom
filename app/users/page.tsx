"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Trash2,
  Edit,
  Plus,
  Search,
  UserCheck,
  Shield,
  Eye,
} from "lucide-react";
import { DashboardShell } from "@/components/ui/dashboardShell";
import { useAuth } from "@/hooks/use-auth.hook";
import { toast } from "sonner";

// Types based on your backend
type Role = "superadmin" | "admin" | "guest";

interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  role?: Role;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  users?: User[];
  user?: User;
}

// Real API functions using your backend
const userApi = {
  getUsers: async (token: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  createUser: async (
    token: string,
    userData: Partial<User>
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  updateUser: async (
    token: string,
    id: number,
    userData: Partial<User>
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  deleteUser: async (token: string, id: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};

export default function UsersPage() {
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "guest" as Role,
  });
  const [submitting, setSubmitting] = useState(false);

  console.log("Current user:", currentUser);

  // Current user role from auth context
  const currentUserRole: Role = currentUser?.role as Role;

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    if (!token) {
      toast.error("Token tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.getUsers(token);

      if (response.success && response.users) {
        setUsers(response.users);
      } else {
        toast.error(response.message || "Gagal mengambil data pengguna");
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "Gagal mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({ email: "", name: "", role: "guest" });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role || "guest",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.name) {
      toast.error("Email dan nama harus diisi");
      return;
    }

    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    try {
      setSubmitting(true);
      let response;

      if (editingUser) {
        response = await userApi.updateUser(token, editingUser.id, formData);
      } else {
        response = await userApi.createUser(token, formData);
      }

      if (response.success) {
        toast.success(
          response.message ||
            `Pengguna berhasil ${editingUser ? "diperbarui" : "ditambahkan"}`
        );
        setShowModal(false);
        fetchUsers();
      } else {
        toast.error(
          response.message ||
            `Gagal ${editingUser ? "memperbarui" : "menambahkan"} pengguna`
        );
      }
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast.error(
        error.message ||
          `Gagal ${editingUser ? "memperbarui" : "menambahkan"} pengguna`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${user.name}?`)) {
      try {
        const response = await userApi.deleteUser(token, user.id);

        if (response.success) {
          toast.success(response.message || "Pengguna berhasil dihapus");
          fetchUsers();
        } else {
          toast.error(response.message || "Gagal menghapus pengguna");
        }
      } catch (error: any) {
        console.error("Error deleting user:", error);
        toast.error(error.message || "Gagal menghapus pengguna");
      }
    }
  };

  const getRoleIcon = (role?: Role) => {
    switch (role) {
      case "superadmin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "admin":
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case "guest":
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role?: Role) => {
    switch (role) {
      case "superadmin":
        return "bg-red-100 text-red-800 border-red-200";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "guest":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const canEditUser = (user: User) => {
    if (currentUserRole === "superadmin") return true;
    if (currentUserRole === "admin" && user.role !== "superadmin") return true;
    return false;
  };

  const canDeleteUser = (user: User) => {
    if (currentUserRole === "superadmin") return true;
    if (currentUserRole === "admin" && user.role === "guest") return true;
    return false;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Check if user has permission to access this page
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Pengguna
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola pengguna dan peran mereka
            </p>
          </div>

          {currentUserRole === "superadmin" && (
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Pengguna
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role | "all")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Peran</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            user.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
                          }
                          alt={user.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role || "Tidak Ada Peran"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {canEditUser(user) && (
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit pengguna"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {canDeleteUser(user) && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Hapus pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Tidak ada pengguna ditemukan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedRole !== "all"
                  ? "Coba sesuaikan filter pencarian Anda"
                  : "Mulai dengan menambahkan pengguna baru"}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@example.com"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nama Lengkap"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peran
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as Role })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={submitting}
                  >
                    <option value="guest">Guest</option>
                    <option value="admin">Admin</option>
                    {currentUserRole === "superadmin" && (
                      <option value="superadmin">Super Admin</option>
                    )}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={submitting}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Menyimpan..."
                      : editingUser
                        ? "Perbarui"
                        : "Buat"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
