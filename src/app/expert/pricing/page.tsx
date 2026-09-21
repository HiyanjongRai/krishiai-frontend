"use client";

import React, { useEffect, useState } from "react";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { packageService } from "@/services/packageService";
import { masterDataService } from "@/services/master-data";
import { useToast } from "@/providers/toast-provider";
import type {
  ConsultationPackage,
  CreateConsultationPackageRequest,
  UpdateConsultationPackageRequest,
} from "@/types/payment";
import type { CropResponse } from "@/types/master-data";

export default function ExpertPricingPage() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<ConsultationPackage[]>([]);
  const [crops, setCrops] = useState<CropResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ConsultationPackage | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [cropId, setCropId] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(500);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pkgs, cropsRes] = await Promise.all([
        packageService.listMyPackages(),
        masterDataService.getCrops({ size: 100 }).catch(() => ({ content: [] })),
      ]);
      setPackages(pkgs);
      if (cropsRes && 'content' in cropsRes) {
        setCrops(cropsRes.content);
      }
    } catch (err: any) {
      toast.error({ title: "Failed to load packages", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingPackage(null);
    setName("");
    setCropId(null);
    setPrice(500);
    setDurationHours(24);
    setDescription("");
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: ConsultationPackage) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setCropId(pkg.cropId);
    setPrice(pkg.price);
    setDurationHours(pkg.durationHours);
    setDescription(pkg.description || "");
    setActive(pkg.active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error({ title: "Package name is required" });
      return;
    }
    if (price < 50) {
      toast.error({ title: "Minimum consultation fee is NPR 50" });
      return;
    }

    try {
      setSubmitting(true);
      if (editingPackage) {
        const updateReq: UpdateConsultationPackageRequest = {
          name: name.trim(),
          description: description.trim() || undefined,
          price,
          durationHours,
          active,
        };
        const updated = await packageService.updatePackage(editingPackage.id, updateReq);
        setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success({ title: "Package updated successfully" });
      } else {
        const createReq: CreateConsultationPackageRequest = {
          name: name.trim(),
          cropId: cropId || undefined,
          description: description.trim() || undefined,
          price,
          durationHours,
          currency: "NPR",
        };
        const created = await packageService.createPackage(createReq);
        setPackages((prev) => [created, ...prev]);
        toast.success({ title: "Consultation package created!" });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error({ title: "Operation failed", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (pkg: ConsultationPackage) => {
    if (!confirm(`Are you sure you want to deactivate package "${pkg.name}"?`)) return;
    try {
      await packageService.deletePackage(pkg.id);
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, active: false } : p))
      );
      toast.success({ title: "Package deactivated" });
    } catch (err: any) {
      toast.error({ title: "Failed to deactivate", description: err.message });
    }
  };

  // 5% platform commission calculation
  const platformFee = Math.round(price * 0.05);
  const netEarnings = price - platformFee;

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Tag className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-[#1F2937]">Consultation Packages</h1>
          </div>
          <p className="text-sm text-[#6B7280]">
            Set transparent consultation rates and service durations for farmers in Nepal.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Package</span>
        </button>
      </div>

      {/* Info Card: Commission Structure */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#166534] leading-relaxed">
          <span className="font-bold">KrishiAI Transparent 95/5 Payout Model:</span> Farmers pay securely through eSewa. You receive 95% directly into your KrishiAI wallet immediately upon payment verification, and 5% is allocated for platform infrastructure and payment gateway processing.
        </div>
      </div>

      {/* Packages Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-[24px] border border-[#E5E7EB]">
          <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32] mb-2" />
          <p className="text-sm text-[#6B7280]">Loading your packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-[24px] border border-[#E5E7EB] text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-4">
            <Tag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-1">No Pricing Packages Yet</h3>
          <p className="text-sm text-[#6B7280] max-w-md mb-6">
            Create your first advisory package so farmers can discover your expertise and initiate paid consultations.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Consultation Package</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between p-5 ${
                pkg.active
                  ? "border-[#E5E7EB] shadow-xs hover:border-[#A5D6A7] hover:shadow-md"
                  : "border-gray-200 bg-gray-50/50 opacity-75"
              }`}
            >
              <div>
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      pkg.active
                        ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {pkg.active ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Inactive</span>
                      </>
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B5563] bg-[#F3F4F6] px-2 py-0.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>{pkg.durationHours}h Window</span>
                  </span>
                </div>

                {/* Package Name */}
                <h3 className="text-lg font-bold text-[#1F2937] mb-1.5 line-clamp-1">
                  {pkg.name}
                </h3>

                {/* Crop Tag */}
                <div className="flex items-center gap-1.5 text-xs text-[#059669] font-medium mb-3">
                  <Sprout className="w-3.5 h-3.5 shrink-0" />
                  <span>{pkg.cropName ? `Crop: ${pkg.cropName}` : "All Crops Advisory"}</span>
                </div>

                {/* Price Display */}
                <div className="p-3.5 bg-[#F9FAFB] rounded-xl mb-3 border border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#1F2937]">
                      NPR {Number(pkg.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-[#6B7280] font-medium">/ session</span>
                  </div>
                  <div className="text-[11px] text-[#2E7D32] font-semibold mt-1 flex items-center justify-between">
                    <span>You receive: NPR {Math.round(Number(pkg.price) * 0.95).toLocaleString()}</span>
                    <span className="text-[#9CA3AF]">5% platform fee</span>
                  </div>
                </div>

                {/* Description */}
                {pkg.description && (
                  <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed mb-4">
                    {pkg.description}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {pkg.active && (
                  <button
                    onClick={() => handleDeactivate(pkg)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Deactivate</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create or Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-xl border border-[#E5E7EB] relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
                  <Tag className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-[#1F2937]">
                  {editingPackage ? "Edit Package" : "Create Consultation Package"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Package Name */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rapid Pest & Disease Assessment (24h)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-[#1F2937]"
                  required
                />
              </div>

              {/* Crop Specialization */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Target Crop (Optional)
                </label>
                <select
                  value={cropId || ""}
                  onChange={(e) => setCropId(e.target.value ? Number(e.target.value) : null)}
                  disabled={!!editingPackage}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-[#1F2937] bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">All Crops &amp; General Farming</option>
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {editingPackage && (
                  <p className="text-[11px] text-gray-400 mt-1">Crop cannot be changed after creation.</p>
                )}
              </div>

              {/* Price & Duration Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">
                    Fee (NPR) *
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-[#1F2937]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">
                    Duration Window *
                  </label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-[#1F2937] bg-white"
                  >
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours (1 Day)</option>
                    <option value={48}>48 Hours (2 Days)</option>
                    <option value={72}>72 Hours (3 Days)</option>
                    <option value={168}>168 Hours (7 Days)</option>
                  </select>
                </div>
              </div>

              {/* Earning Calculation Preview */}
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3 text-xs">
                <div className="flex justify-between text-[#166534] font-medium mb-1">
                  <span>Gross Consultation Price:</span>
                  <span>NPR {price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#166534] mb-1">
                  <span>Platform Fee (5%):</span>
                  <span>- NPR {platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#15803D] font-bold pt-1 border-t border-[#86EFAC]">
                  <span>Your Net Earnings:</span>
                  <span>NPR {netEarnings.toLocaleString()}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  What&apos;s Included (Description)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. Diagnosis based on plant photos, tailored chemical or bio-fertilizer prescription, and follow-up Q&A within the duration window."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-[#1F2937]"
                />
              </div>

              {/* Active Toggle (Editing only) */}
              {editingPackage && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="active-toggle"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="active-toggle" className="text-xs font-bold text-[#374151] cursor-pointer">
                    Keep package active and visible to farmers
                  </label>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingPackage ? "Save Changes" : "Create Package"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
