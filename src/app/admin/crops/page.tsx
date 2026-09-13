"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sprout,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Tag,
  X,
  Layers,
  Sparkles,
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

export default function AdminCropsPage() {
  const { toast } = useToast();

  const [categories, setCategories] = useState<CropCategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CropCategoryResponse | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formActive, setFormActive] = useState(true);

  const loadCategories = useCallback(async () => {
    setError(null);
    try {
      const data = await adminService.getCropCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load crop categories. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCategories();
    setIsRefreshing(false);
  };

  const openCreateModal = () => {
    setFormName("");
    setFormCode("");
    setFormDescription("");
    setFormIcon("🌱");
    setFormActive(true);
    setIsCreateOpen(true);
  };

  const openEditModal = (cat: CropCategoryResponse) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormCode(cat.code);
    setFormDescription(cat.description || "");
    setFormIcon(cat.icon || "🌱");
    setFormActive(cat.active);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      toast.error({
        title: "Validation Error",
        description: "Category name and unique code are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateCropCategoryRequest = {
        name: formName.trim(),
        code: formCode.trim().toUpperCase().replace(/\s+/g, "_"),
        description: formDescription.trim() || undefined,
        icon: formIcon.trim() || undefined,
      };

      const created = await adminService.createCropCategory(payload);
      setCategories((prev) => [...prev, created]);
      setIsCreateOpen(false);
      toast.success({
        title: "Category Created",
        description: `Crop category "${created.name}" has been registered.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category.";
      toast.error({ title: "Creation Failed", description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!formName.trim() || !formCode.trim()) {
      toast.error({
        title: "Validation Error",
        description: "Category name and unique code are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateCropCategoryRequest = {
        name: formName.trim(),
        code: formCode.trim().toUpperCase().replace(/\s+/g, "_"),
        description: formDescription.trim() || undefined,
        icon: formIcon.trim() || undefined,
        active: formActive,
      };

      const updated = await adminService.updateCropCategory(editingCategory.id, payload);
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCategory(null);
      toast.success({
        title: "Category Updated",
        description: `Updated "${updated.name}" successfully.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update category.";
      toast.error({ title: "Update Failed", description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminService.deleteCropCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeletingCategoryId(null);
      toast.success({
        title: "Category Deleted",
        description: "The crop category was successfully removed.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete category.";
      toast.error({ title: "Action Failed", description: msg });
    }
  };

  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        !search ||
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.code.toLowerCase().includes(search.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && cat.active) ||
        (statusFilter === "INACTIVE" && !cat.active);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Crop Taxonomy</h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Define and maintain crop categories, classification codes, and domain taxonomies across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-2xs cursor-pointer"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
          </button>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Categories</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{categories.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Taxonomies</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {categories.filter((c) => c.active).length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deactivated / Draft</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {categories.filter((c) => !c.active).length}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search category name, code, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All" : st === "ACTIVE" ? "Active" : "Inactive"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadCategories} className="font-bold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-medium">Loading crop categories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Sprout className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">No crop categories found</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              {search ? "No categories match your search term." : "Create your first agricultural taxonomy category."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base border border-slate-200">
                          {cat.icon || "🌱"}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{cat.name}</p>
                          <span className="text-[10px] text-slate-400">ID: #{cat.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                        {cat.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          cat.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.active ? "bg-emerald-600" : "bg-slate-400"
                          }`}
                        />
                        {cat.active ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCategoryId(cat.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── CREATE MODAL ──────────────────────────────────────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">New Crop Category</h3>
                <p className="text-xs text-slate-500">Register category taxonomy code.</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <Input
                label="Category Name *"
                placeholder="e.g. Cereals & Grains"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!formCode) {
                    setFormCode(e.target.value.toUpperCase().replace(/\s+/g, "_"));
                  }
                }}
                required
              />

              <Input
                label="Unique Code *"
                placeholder="e.g. CEREAL_GRAINS"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                required
              />

              <Input
                label="Icon / Emoji"
                placeholder="e.g. 🌾 or 🌽"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Classification criteria and scope..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} loadingText="Saving...">
                  Create Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT MODAL ────────────────────────────────────────────────── */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Category</h3>
                <p className="text-xs text-slate-500">Update taxonomy definition and status.</p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <Input
                label="Category Name *"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <Input
                label="Unique Code *"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                required
              />

              <Input
                label="Icon / Emoji"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="formActive" className="text-xs font-semibold text-slate-700">
                  Active in platform crop selections
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} loadingText="Saving...">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE DIALOG ─────────────────────────────────────────────── */}
      {deletingCategoryId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Crop Category?</h3>
                <p className="text-xs text-slate-500">Confirm taxonomy removal</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this category? Crops assigned to this category will have their category unlinked.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="outline" onClick={() => setDeletingCategoryId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(deletingCategoryId)}>
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
