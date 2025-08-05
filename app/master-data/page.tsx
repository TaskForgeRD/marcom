"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Settings, Users, Tag, Layers, Grid3X3 } from "lucide-react";
import MasterDataTable from "@/app/master-data/components/masterDataTable";
import CreateEditDialog from "@/app/master-data/components/createEditDialog";
import DeleteConfirmDialog from "@/app/master-data/components/deleteConfirmDialog";
import { useMasterDataStore } from "@/stores/master-data.store";
import { DashboardShell } from "@/components/ui/dashboardShell";

export default function MasterDataPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get tab from URL, default to 'brands'
  const tabFromUrl = searchParams.get("tab") || "brands";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const {
    brands,
    clusters,
    fitur,
    jenis,
    createBrand,
    updateBrand,
    deleteBrand,
    createCluster,
    updateCluster,
    deleteCluster,
    createFitur,
    updateFitur,
    deleteFitur,
    createJenis,
    updateJenis,
    deleteJenis,
    fetchAllData,
  } = useMasterDataStore();

  // Fetch data when component mounts
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // PERBAIKAN: Sinkronkan activeTab dengan URL setiap kali searchParams berubah
  useEffect(() => {
    const currentTab = searchParams.get("tab") || "brands";
    setActiveTab(currentTab);
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/master-data?tab=${newTab}`, { scroll: false });
  };

  const tabsConfig = [
    {
      id: "brands",
      label: "Brand",
      icon: Tag,
      data: brands,
      createFn: createBrand,
      updateFn: updateBrand,
      deleteFn: deleteBrand,
      description: "Kelola data brand yang tersedia dalam sistem",
    },
    {
      id: "clusters", // PERBAIKAN: ubah dari "clusters" ke "cluster" untuk konsistensi dengan URL
      label: "Cluster",
      icon: Grid3X3,
      data: clusters,
      createFn: createCluster,
      updateFn: updateCluster,
      deleteFn: deleteCluster,
      description: "Kelola data cluster untuk kategorisasi materi",
    },
    {
      id: "fitur",
      label: "Fitur",
      icon: Layers,
      data: fitur,
      createFn: createFitur,
      updateFn: updateFitur,
      deleteFn: deleteFitur,
      description: "Kelola data fitur yang tersedia",
    },
    {
      id: "jenis",
      label: "Jenis",
      icon: Users,
      data: jenis,
      createFn: createJenis,
      updateFn: updateJenis,
      deleteFn: deleteJenis,
      description: "Kelola data jenis materi komunikasi",
    },
  ];

  const activeConfig = tabsConfig.find((tab) => tab.id === activeTab);

  const handleCreate = () => {
    setSelectedItem(null);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (name: string) => {
    if (!activeConfig) return;

    try {
      if (selectedItem) {
        await activeConfig.updateFn(selectedItem.id, name);
      } else {
        await activeConfig.createFn(name);
      }
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeConfig || !selectedItem) return;

    try {
      await activeConfig.deleteFn(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <DashboardShell title="Master Data">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
            <p className="text-sm text-gray-600">Kelola data master</p>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manajemen Data Master
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4">
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full ml-1">
                        {tab.data.length}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tabsConfig.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Data {tab.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {tab.description}
                        </p>
                      </div>
                    </div>

                    <MasterDataTable
                      data={tab.data}
                      entityName={tab.label}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCreate={handleCreate}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <CreateEditDialog
          open={isCreateDialogOpen}
          onClose={() => {
            setIsCreateDialogOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
          title={`Tambah ${activeConfig?.label}`}
          entityName={activeConfig?.label.toLowerCase() || ""}
        />

        <CreateEditDialog
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
          title={`Edit ${activeConfig?.label}`}
          entityName={activeConfig?.label.toLowerCase() || ""}
          initialValue={selectedItem?.name}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={selectedItem?.name}
          entityName={activeConfig?.label.toLowerCase() || ""}
        />
      </div>
    </DashboardShell>
  );
}
