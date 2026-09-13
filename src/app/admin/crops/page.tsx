"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import { adminService } from "@/services/admin";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreateCropCategoryRequest,
  CropCategoryResponse,
  UpdateCropCategoryRequest,
} from "@/types/crop-category";
import type {
  CreateCropRequest,
  CreateLocationRequest,
  CropResponse,
  LocationResponse,
  LocationType,
  MunicipalityType,
  UpdateCropRequest,
  UpdateLocationRequest,
} from "@/types/master-data";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";
type ModalMode = "create" | "edit";

const LOCATION_TYPES: LocationType[] = ["PROVINCE", "DISTRICT", "MUNICIPALITY"];
const MUNICIPALITY_TYPES: MunicipalityType[] = [
  "METROPOLITAN_CITY",
  "SUB_METROPOLITAN_CITY",
  "MUNICIPALITY",
  "RURAL_MUNICIPALITY",
];

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function typeLabel(value?: string | null) {
  if (!value) return "-";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusBadge(active: boolean) {
  return active
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-slate-200 bg-slate-100 text-slate-500";
}

export default function AdminCropsPage() {
  const { toast } = useToast();

  const [categories, setCategories] = useState<CropCategoryResponse[]>([]);
  const [crops, setCrops] = useState<CropResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [categoryModal, setCategoryModal] = useState<{ mode: ModalMode; category?: CropCategoryResponse } | null>(null);
  const [cropModal, setCropModal] = useState<{ mode: ModalMode; crop?: CropResponse } | null>(null);
  const [locationModal, setLocationModal] = useState<{ mode: ModalMode; location?: LocationResponse } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: "category"; id: number; name: string }
    | { kind: "crop"; id: number; name: string }
    | { kind: "location"; id: number; name: string; type: LocationType }
    | null
  >(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    code: "",
    description: "",
    icon: "",
    active: true,
  });
  const [cropForm, setCropForm] = useState({
    categoryId: "",
    name: "",
    scientificName: "",
    nepaliName: "",
    imageUrl: "",
    description: "",
    active: true,
  });
  const [locationForm, setLocationForm] = useState({
    type: "PROVINCE" as LocationType,
    parentId: "",
    name: "",
    nepaliName: "",
    code: "",
    municipalityType: "MUNICIPALITY" as MunicipalityType,
    active: true,
  });

  const loadMasterData = useCallback(async () => {
    setError(null);
    try {
      const [categoryData, cropPage, locationData] = await Promise.all([
        adminService.getCropCategories(),
        adminService.getCrops({ activeOnly: false, size: 250 }),
        adminService.adminGetLocations({ activeOnly: false }),
      ]);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setCrops(cropPage.content ?? []);
      setLocations(locationData);
    } catch {
      setError("Unable to load crop and location master data. Please check the backend connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMasterData();
  }, [loadMasterData]);

  const provinceOptions = useMemo(
    () => locations.filter((location) => location.type === "PROVINCE" && location.active),
    [locations]
  );

  const districtOptions = useMemo(
    () => locations.filter((location) => location.type === "DISTRICT" && location.active),
    [locations]
  );

  const locationParentOptions = locationForm.type === "DISTRICT" ? provinceOptions : districtOptions;

  const matchesSearch = useCallback(
    (...values: Array<string | null | undefined>) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return values.some((value) => value?.toLowerCase().includes(query));
    },
    [search]
  );

  const matchesStatus = useCallback(
    (active: boolean) =>
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && active) ||
      (statusFilter === "INACTIVE" && !active),
    [statusFilter]
  );

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          matchesStatus(category.active) &&
          matchesSearch(category.name, category.code, category.description)
      ),
    [categories, matchesSearch, matchesStatus]
  );

  const filteredCrops = useMemo(
    () =>
      crops.filter(
        (crop) =>
          matchesStatus(crop.active) &&
          matchesSearch(crop.name, crop.nepaliName, crop.scientificName, crop.categoryName)
      ),
    [crops, matchesSearch, matchesStatus]
  );

  const filteredLocations = useMemo(
    () =>
      locations.filter(
        (location) =>
          matchesStatus(location.active) &&
          matchesSearch(location.name, location.nepaliName, location.code, location.parentName, location.type)
      ),
    [locations, matchesSearch, matchesStatus]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMasterData();
    setIsRefreshing(false);
  };

  const openCategoryModal = (category?: CropCategoryResponse) => {
    setCategoryForm({
      name: category?.name ?? "",
      code: category?.code ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
      active: category?.active ?? true,
    });
    setCategoryModal({ mode: category ? "edit" : "create", category });
  };

  const openCropModal = (crop?: CropResponse) => {
    setCropForm({
      categoryId: crop?.categoryId ? String(crop.categoryId) : String(categories.find((item) => item.active)?.id ?? ""),
      name: crop?.name ?? "",
      scientificName: crop?.scientificName ?? "",
      nepaliName: crop?.nepaliName ?? "",
      imageUrl: crop?.imageUrl ?? "",
      description: crop?.description ?? "",
      active: crop?.active ?? true,
    });
    setCropModal({ mode: crop ? "edit" : "create", crop });
  };

  const openLocationModal = (location?: LocationResponse, type?: LocationType) => {
    const nextType = location?.type ?? type ?? "PROVINCE";
    setLocationForm({
      type: nextType,
      parentId: location?.parentId ? String(location.parentId) : "",
      name: location?.name ?? "",
      nepaliName: location?.nepaliName ?? "",
      code: location?.code ?? "",
      municipalityType: location?.municipalityType ?? "MUNICIPALITY",
      active: location?.active ?? true,
    });
    setLocationModal({ mode: location ? "edit" : "create", location });
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryForm.name.trim() || !categoryForm.code.trim()) {
      toast.error({ title: "Validation Error", description: "Category name and code are required." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateCropCategoryRequest | UpdateCropCategoryRequest = {
        name: categoryForm.name.trim(),
        code: normalizeCode(categoryForm.code),
        description: categoryForm.description.trim() || undefined,
        icon: categoryForm.icon.trim() || undefined,
        active: categoryForm.active,
      };

      if (categoryModal?.mode === "edit" && categoryModal.category) {
        await adminService.updateCropCategory(categoryModal.category.id, payload);
        toast.success({ title: "Category Updated", description: "Crop category changes were saved." });
      } else {
        await adminService.createCropCategory(payload as CreateCropCategoryRequest);
        toast.success({ title: "Category Created", description: "New crop category is ready to use." });
      }
      setCategoryModal(null);
      await loadMasterData();
    } catch (err: unknown) {
      toast.error({
        title: "Save Failed",
        description: err instanceof Error ? err.message : "Unable to save the category.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveCrop = async (event: React.FormEvent) => {
    event.preventDefault();
    const categoryId = Number(cropForm.categoryId);
    if (!categoryId || !cropForm.name.trim()) {
      toast.error({ title: "Validation Error", description: "Crop name and category are required." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateCropRequest | UpdateCropRequest = {
        categoryId,
        name: cropForm.name.trim(),
        scientificName: cropForm.scientificName.trim() || undefined,
        nepaliName: cropForm.nepaliName.trim() || undefined,
        imageUrl: cropForm.imageUrl.trim() || undefined,
        description: cropForm.description.trim() || undefined,
        active: cropForm.active,
      };

      if (cropModal?.mode === "edit" && cropModal.crop) {
        await adminService.adminUpdateCrop(cropModal.crop.id, payload);
        toast.success({ title: "Crop Updated", description: "Crop record changes were saved." });
      } else {
        await adminService.adminCreateCrop(payload as CreateCropRequest);
        toast.success({ title: "Crop Created", description: "New crop record is available for selection." });
      }
      setCropModal(null);
      await loadMasterData();
    } catch (err: unknown) {
      toast.error({
        title: "Save Failed",
        description: err instanceof Error ? err.message : "Unable to save the crop.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveLocation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!locationForm.name.trim()) {
      toast.error({ title: "Validation Error", description: "Location name is required." });
      return;
    }
    if (locationForm.type !== "PROVINCE" && !locationForm.parentId) {
      toast.error({ title: "Validation Error", description: "Select the parent location." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateLocationRequest | UpdateLocationRequest = {
        name: locationForm.name.trim(),
        nepaliName: locationForm.nepaliName.trim() || undefined,
        code: locationForm.code.trim() ? normalizeCode(locationForm.code) : undefined,
        active: locationForm.active,
        parentId: locationForm.type === "PROVINCE" ? undefined : Number(locationForm.parentId),
        municipalityType: locationForm.type === "MUNICIPALITY" ? locationForm.municipalityType : undefined,
      };

      if (locationModal?.mode === "edit" && locationModal.location) {
        if (locationForm.type === "PROVINCE") {
          await adminService.adminUpdateProvince(locationModal.location.id, payload);
        } else if (locationForm.type === "DISTRICT") {
          await adminService.adminUpdateDistrict(locationModal.location.id, payload);
        } else {
          await adminService.adminUpdateMunicipality(locationModal.location.id, payload);
        }
        toast.success({ title: "Location Updated", description: "Location hierarchy changes were saved." });
      } else if (locationForm.type === "PROVINCE") {
        await adminService.adminCreateProvince(payload as CreateLocationRequest);
        toast.success({ title: "Province Created", description: "New province is available." });
      } else if (locationForm.type === "DISTRICT") {
        await adminService.adminCreateDistrict(payload as CreateLocationRequest);
        toast.success({ title: "District Created", description: "New district is available." });
      } else {
        await adminService.adminCreateMunicipality(payload as CreateLocationRequest);
        toast.success({ title: "Municipality Created", description: "New municipality is available." });
      }
      setLocationModal(null);
      await loadMasterData();
    } catch (err: unknown) {
      toast.error({
        title: "Save Failed",
        description: err instanceof Error ? err.message : "Unable to save the location.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      if (deleteTarget.kind === "category") {
        await adminService.deleteCropCategory(deleteTarget.id);
      } else if (deleteTarget.kind === "crop") {
        await adminService.adminDeleteCrop(deleteTarget.id);
      } else if (deleteTarget.type === "PROVINCE") {
        await adminService.adminDeleteProvince(deleteTarget.id);
      } else if (deleteTarget.type === "DISTRICT") {
        await adminService.adminDeleteDistrict(deleteTarget.id);
      } else {
        await adminService.adminDeleteMunicipality(deleteTarget.id);
      }
      toast.success({ title: "Record Deactivated", description: `${deleteTarget.name} is no longer active.` });
      setDeleteTarget(null);
      await loadMasterData();
    } catch (err: unknown) {
      toast.error({
        title: "Action Failed",
        description: err instanceof Error ? err.message : "Unable to deactivate the selected record.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
              <Layers className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Crop Master Data</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Maintain crop categories, crop records, and location hierarchy used across registration and expertise flows.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" rounded="default" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
            Refresh
          </Button>
          <Button rounded="default" onClick={() => openCropModal()}>
            <Plus className="h-4 w-4" />
            Add Crop
          </Button>
          <Button rounded="default" onClick={() => openLocationModal()}>
            <MapPin className="h-4 w-4" />
            Add Location
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Categories" value={categories.length} subValue={`${categories.filter((item) => item.active).length} active`} />
        <SummaryCard label="Crops" value={crops.length} subValue={`${crops.filter((item) => item.active).length} active`} />
        <SummaryCard label="Locations" value={locations.length} subValue={`${locations.filter((item) => item.active).length} active`} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories, crops, locations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-600 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status === "ALL" ? "All" : status === "ACTIVE" ? "Active" : "Inactive"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={loadMasterData} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-emerald-600" />
          Loading master data...
        </div>
      ) : (
        <>
          <CategorySection
            categories={filteredCategories}
            onCreate={() => openCategoryModal()}
            onEdit={openCategoryModal}
            onDelete={(category) => setDeleteTarget({ kind: "category", id: category.id, name: category.name })}
          />
          <CropSection
            crops={filteredCrops}
            onCreate={() => openCropModal()}
            onEdit={openCropModal}
            onDelete={(crop) => setDeleteTarget({ kind: "crop", id: crop.id, name: crop.name })}
          />
          <LocationSection
            locations={filteredLocations}
            onCreate={openLocationModal}
            onEdit={openLocationModal}
            onDelete={(location) =>
              setDeleteTarget({ kind: "location", id: location.id, name: location.name, type: location.type })
            }
          />
        </>
      )}

      {categoryModal && (
        <MasterModal
          title={categoryModal.mode === "edit" ? "Edit Category" : "New Category"}
          description="Define the crop taxonomy used for crop grouping and filtering."
          onClose={() => setCategoryModal(null)}
        >
          <form onSubmit={saveCategory} className="space-y-4">
            <Input
              label="Category Name *"
              value={categoryForm.name}
              onChange={(event) => {
                const name = event.target.value;
                setCategoryForm((prev) => ({
                  ...prev,
                  name,
                  code: prev.code ? prev.code : normalizeCode(name),
                }));
              }}
              required
            />
            <Input
              label="Code *"
              value={categoryForm.code}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, code: event.target.value }))}
              required
            />
            <Input
              label="Icon key"
              placeholder="e.g. wheat, apple, leaf"
              value={categoryForm.icon}
              onChange={(event) => setCategoryForm((prev) => ({ ...prev, icon: event.target.value }))}
            />
            <Textarea
              label="Description"
              value={categoryForm.description}
              onChange={(value) => setCategoryForm((prev) => ({ ...prev, description: value }))}
            />
            <ActiveToggle checked={categoryForm.active} onChange={(active) => setCategoryForm((prev) => ({ ...prev, active }))} />
            <ModalActions onCancel={() => setCategoryModal(null)} isSubmitting={isSubmitting} submitLabel="Save Category" />
          </form>
        </MasterModal>
      )}

      {cropModal && (
        <MasterModal
          title={cropModal.mode === "edit" ? "Edit Crop" : "New Crop"}
          description="Create a crop record for expert registration and crop expertise selection."
          onClose={() => setCropModal(null)}
        >
          <form onSubmit={saveCrop} className="space-y-4">
            <Select
              label="Category *"
              value={cropForm.categoryId}
              onChange={(value) => setCropForm((prev) => ({ ...prev, categoryId: value }))}
            >
              <option value="">Select category</option>
              {categories.filter((category) => category.active).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Input
              label="Crop Name *"
              value={cropForm.name}
              onChange={(event) => setCropForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <Input
              label="Scientific Name"
              value={cropForm.scientificName}
              onChange={(event) => setCropForm((prev) => ({ ...prev, scientificName: event.target.value }))}
            />
            <Input
              label="Nepali Name"
              value={cropForm.nepaliName}
              onChange={(event) => setCropForm((prev) => ({ ...prev, nepaliName: event.target.value }))}
            />
            <Input
              label="Image URL"
              value={cropForm.imageUrl}
              onChange={(event) => setCropForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            />
            <Textarea
              label="Description"
              value={cropForm.description}
              onChange={(value) => setCropForm((prev) => ({ ...prev, description: value }))}
            />
            <ActiveToggle checked={cropForm.active} onChange={(active) => setCropForm((prev) => ({ ...prev, active }))} />
            <ModalActions onCancel={() => setCropModal(null)} isSubmitting={isSubmitting} submitLabel="Save Crop" />
          </form>
        </MasterModal>
      )}

      {locationModal && (
        <MasterModal
          title={locationModal.mode === "edit" ? "Edit Location" : "New Location"}
          description="Maintain the province, district, and municipality hierarchy used by registration forms."
          onClose={() => setLocationModal(null)}
        >
          <form onSubmit={saveLocation} className="space-y-4">
            <Select
              label="Location Type *"
              value={locationForm.type}
              onChange={(value) =>
                setLocationForm((prev) => ({
                  ...prev,
                  type: value as LocationType,
                  parentId: "",
                  municipalityType: value === "MUNICIPALITY" ? prev.municipalityType : "MUNICIPALITY",
                }))
              }
              disabled={locationModal.mode === "edit"}
            >
              {LOCATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {typeLabel(type)}
                </option>
              ))}
            </Select>
            {locationForm.type !== "PROVINCE" && (
              <Select
                label={locationForm.type === "DISTRICT" ? "Province *" : "District *"}
                value={locationForm.parentId}
                onChange={(value) => setLocationForm((prev) => ({ ...prev, parentId: value }))}
              >
                <option value="">Select parent</option>
                {locationParentOptions.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            )}
            <Input
              label="Location Name *"
              value={locationForm.name}
              onChange={(event) => {
                const name = event.target.value;
                setLocationForm((prev) => ({
                  ...prev,
                  name,
                  code: prev.code ? prev.code : normalizeCode(name),
                }));
              }}
              required
            />
            <Input
              label="Nepali Name"
              value={locationForm.nepaliName}
              onChange={(event) => setLocationForm((prev) => ({ ...prev, nepaliName: event.target.value }))}
            />
            <Input
              label="Code"
              value={locationForm.code}
              onChange={(event) => setLocationForm((prev) => ({ ...prev, code: event.target.value }))}
            />
            {locationForm.type === "MUNICIPALITY" && (
              <Select
                label="Municipality Type"
                value={locationForm.municipalityType}
                onChange={(value) => setLocationForm((prev) => ({ ...prev, municipalityType: value as MunicipalityType }))}
              >
                {MUNICIPALITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {typeLabel(type)}
                  </option>
                ))}
              </Select>
            )}
            <ActiveToggle checked={locationForm.active} onChange={(active) => setLocationForm((prev) => ({ ...prev, active }))} />
            <ModalActions onCancel={() => setLocationModal(null)} isSubmitting={isSubmitting} submitLabel="Save Location" />
          </form>
        </MasterModal>
      )}

      {deleteTarget && (
        <MasterModal
          title="Deactivate Record"
          description="This keeps the record for history but removes it from active platform selections."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              Deactivate <span className="font-semibold">{deleteTarget.name}</span>?
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button type="button" variant="outline" rounded="default" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button type="button" variant="danger" rounded="default" isLoading={isSubmitting} onClick={confirmDelete}>
                Deactivate
              </Button>
            </div>
          </div>
        </MasterModal>
      )}
    </div>
  );
}

function SummaryCard({ label, value, subValue }: { label: string; value: number; subValue: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subValue}</p>
    </div>
  );
}

function SectionShell({
  title,
  description,
  count,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  description: string;
  count: number;
  actionLabel: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600">
            {count} records
          </span>
          <Button type="button" size="sm" rounded="default" onClick={onAction}>
            <Plus className="h-3.5 w-3.5" />
            {actionLabel}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function CategorySection({
  categories,
  onCreate,
  onEdit,
  onDelete,
}: {
  categories: CropCategoryResponse[];
  onCreate: () => void;
  onEdit: (category: CropCategoryResponse) => void;
  onDelete: (category: CropCategoryResponse) => void;
}) {
  return (
    <SectionShell
      title="Crop Categories"
      description="Classification groups used by crop records and expert expertise."
      count={categories.length}
      actionLabel="Add Category"
      onAction={onCreate}
    >
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Crops</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                No crop categories found.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{category.name}</p>
                  <p className="mt-0.5 max-w-md truncate text-[11px] text-slate-500">{category.description || "No description"}</p>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{category.code}</td>
                <td className="px-4 py-3">{category.cropCount ?? "-"}</td>
                <td className="px-4 py-3">
                  <RecordStatus active={category.active} />
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActions onEdit={() => onEdit(category)} onDelete={() => onDelete(category)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SectionShell>
  );
}

function CropSection({
  crops,
  onCreate,
  onEdit,
  onDelete,
}: {
  crops: CropResponse[];
  onCreate: () => void;
  onEdit: (crop: CropResponse) => void;
  onDelete: (crop: CropResponse) => void;
}) {
  return (
    <SectionShell
      title="Crop Records"
      description="Active crops appear in expert registration and crop expertise selection."
      count={crops.length}
      actionLabel="Add Crop"
      onAction={onCreate}
    >
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Crop</th>
            <th className="px-4 py-3">Scientific Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {crops.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                No crop records found.
              </td>
            </tr>
          ) : (
            crops.map((crop) => (
              <tr key={crop.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    {crop.imageUrl ? (
                      <Image src={crop.imageUrl} alt={crop.name} fill sizes="40px" className="object-contain p-1" unoptimized />
                    ) : (
                      <Sprout className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{crop.name}</p>
                  {crop.nepaliName && <p className="mt-0.5 text-[11px] text-slate-500">{crop.nepaliName}</p>}
                </td>
                <td className="px-4 py-3 italic text-slate-500">{crop.scientificName || "-"}</td>
                <td className="px-4 py-3">{crop.categoryName || "-"}</td>
                <td className="px-4 py-3">
                  <RecordStatus active={crop.active} />
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {crop.defaultCrop ? "System" : "Admin"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActions onEdit={() => onEdit(crop)} onDelete={() => onDelete(crop)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SectionShell>
  );
}

function LocationSection({
  locations,
  onCreate,
  onEdit,
  onDelete,
}: {
  locations: LocationResponse[];
  onCreate: (location?: LocationResponse, type?: LocationType) => void;
  onEdit: (location: LocationResponse) => void;
  onDelete: (location: LocationResponse) => void;
}) {
  return (
    <SectionShell
      title="Location Hierarchy"
      description="Province, district, and municipality records used in profile and registration forms."
      count={locations.length}
      actionLabel="Add Location"
      onAction={() => onCreate(undefined, "PROVINCE")}
    >
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Parent</th>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {locations.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                No location records found.
              </td>
            </tr>
          ) : (
            locations.map((location) => (
              <tr key={location.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{location.name}</p>
                  {location.nepaliName && <p className="mt-0.5 text-[11px] text-slate-500">{location.nepaliName}</p>}
                </td>
                <td className="px-4 py-3">{typeLabel(location.municipalityType || location.type)}</td>
                <td className="px-4 py-3">{location.parentName || "-"}</td>
                <td className="px-4 py-3 font-mono text-[11px]">{location.code || "-"}</td>
                <td className="px-4 py-3">
                  <RecordStatus active={location.active} />
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActions onEdit={() => onEdit(location)} onDelete={() => onDelete(location)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SectionShell>
  );
}

function RecordStatus({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${statusBadge(active)}`}>
      <CheckCircle2 className="h-3 w-3" />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-emerald-700"
        title="Edit record"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
        title="Deactivate record"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function MasterModal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-600"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-600 disabled:bg-slate-100 disabled:text-slate-500"
      >
        {children}
      </select>
    </div>
  );
}

function ActiveToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
      />
      Active in platform selections
    </label>
  );
}

function ModalActions({
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <Button type="button" variant="outline" rounded="default" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" rounded="default" isLoading={isSubmitting} loadingText="Saving...">
        {submitLabel}
      </Button>
    </div>
  );
}
