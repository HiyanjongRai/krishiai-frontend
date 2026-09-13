"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  RefreshCw,
  Compass,
  Sprout,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Layers,
  X,
  Loader2,
  Info,
  Calendar,
} from "lucide-react";
import { farmService } from "@/services/farm";
import { locationService } from "@/services/location";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreateFarmRequest,
  FarmAreaUnit,
  FarmResponse,
  FarmType,
  UpdateFarmRequest,
} from "@/types/farm";
import type { LocationResponse } from "@/types/location";

const AREA_UNITS: { label: string; value: FarmAreaUnit }[] = [
  { label: "Ropani (रोपनी)", value: "ROPANI" },
  { label: "Bigha (बिघा)", value: "BIGHA" },
  { label: "Hectares (हेक्टर)", value: "HECTARE" },
  { label: "Acres (एकर)", value: "ACRE" },
  { label: "Square Meters (वर्ग मिटर)", value: "SQUARE_METER" },
];

const FARM_TYPES: { label: string; value: FarmType; description: string }[] = [
  { label: "Crop Farm", value: "CROP_FARM", description: "Cereals, cash crops, grains & vegetables" },
  { label: "Horticulture", value: "HORTICULTURE", description: "Fruits, herbs, floral & nursery cultivation" },
  { label: "Livestock", value: "LIVESTOCK", description: "Poultry, cattle, goats, & dairy farming" },
  { label: "Mixed Farming", value: "MIXED", description: "Integrated agriculture & animal husbandry" },
  { label: "Aquaculture", value: "AQUACULTURE", description: "Fisheries & aquatic farming systems" },
  { label: "Other", value: "OTHER", description: "Alternative or specialized agro-ecosystems" },
];

export default function FarmerFarmsPage() {
  const { toast } = useToast();

  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search and filter
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<FarmResponse | null>(null);
  const [deletingFarmId, setDeletingFarmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formFarmName, setFormFarmName] = useState("");
  const [formLocationId, setFormLocationId] = useState<string>("");
  const [formArea, setFormArea] = useState<string>("");
  const [formAreaUnit, setFormAreaUnit] = useState<FarmAreaUnit>("ROPANI");
  const [formFarmType, setFormFarmType] = useState<FarmType>("CROP_FARM");
  const [formDescription, setFormDescription] = useState("");
  const [formLatitude, setFormLatitude] = useState<string>("");
  const [formLongitude, setFormLongitude] = useState<string>("");

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [farmsData, locationsData] = await Promise.all([
        farmService.getFarms(),
        locationService.getLocations().catch(() => []),
      ]);
      setFarms(Array.isArray(farmsData) ? farmsData : []);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
    } catch {
      setError("Unable to load farms list. Please verify your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const openCreateModal = () => {
    setFormFarmName("");
    setFormLocationId(locations[0]?.id?.toString() || "");
    setFormArea("");
    setFormAreaUnit("ROPANI");
    setFormFarmType("CROP_FARM");
    setFormDescription("");
    setFormLatitude("");
    setFormLongitude("");
    setIsCreateOpen(true);
  };

  const openEditModal = (farm: FarmResponse) => {
    setEditingFarm(farm);
    setFormFarmName(farm.farmName || "");
    setFormLocationId(farm.location?.id?.toString() || "");
    setFormArea(farm.area ? farm.area.toString() : "");
    setFormAreaUnit(farm.areaUnit || "ROPANI");
    setFormFarmType(farm.farmType || "CROP_FARM");
    setFormDescription(farm.description || "");
    setFormLatitude(farm.latitude ? farm.latitude.toString() : "");
    setFormLongitude(farm.longitude ? farm.longitude.toString() : "");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error({
        title: "Geolocation unavailable",
        description: "Your browser does not support automatic geolocation.",
      });
      return;
    }

    toast.info({
      title: "Locating farm...",
      description: "Requesting coordinates from device GPS.",
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLatitude(pos.coords.latitude.toFixed(6));
        setFormLongitude(pos.coords.longitude.toFixed(6));
        toast.success({
          title: "GPS Captured",
          description: `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`,
        });
      },
      () => {
        toast.error({
          title: "Permission denied",
          description: "Unable to retrieve device location. You can enter coordinates manually.",
        });
      },
      { timeout: 10000 }
    );
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFarmName.trim()) {
      toast.error({ title: "Farm name required", description: "Please provide a name for your farm." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateFarmRequest = {
        farmName: formFarmName.trim(),
        locationId: formLocationId ? Number(formLocationId) : undefined,
        area: formArea ? Number(formArea) : undefined,
        areaUnit: formAreaUnit,
        farmType: formFarmType,
        description: formDescription.trim() || undefined,
        latitude: formLatitude ? Number(formLatitude) : undefined,
        longitude: formLongitude ? Number(formLongitude) : undefined,
      };

      const created = await farmService.createFarm(payload);
      setFarms((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      toast.success({
        title: "Farm Registered",
        description: `"${created.farmName}" has been successfully added to your portfolio.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register farm.";
      toast.error({ title: "Registration failed", description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFarm) return;
    if (!formFarmName.trim()) {
      toast.error({ title: "Farm name required", description: "Please provide a valid farm name." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateFarmRequest = {
        farmName: formFarmName.trim(),
        locationId: formLocationId ? Number(formLocationId) : undefined,
        area: formArea ? Number(formArea) : undefined,
        areaUnit: formAreaUnit,
        farmType: formFarmType,
        description: formDescription.trim() || undefined,
        latitude: formLatitude ? Number(formLatitude) : undefined,
        longitude: formLongitude ? Number(formLongitude) : undefined,
      };

      const updated = await farmService.updateFarm(editingFarm.id, payload);
      setFarms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      setEditingFarm(null);
      toast.success({
        title: "Farm Updated",
        description: `Changes to "${updated.farmName}" saved successfully.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update farm.";
      toast.error({ title: "Update failed", description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await farmService.deleteFarm(id);
      setFarms((prev) => prev.filter((f) => f.id !== id));
      setDeletingFarmId(null);
      toast.success({
        title: "Farm Removed",
        description: "Farm has been soft-deleted from your active list.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete farm.";
      toast.error({ title: "Action failed", description: msg });
    }
  };

  const filteredFarms = useMemo(() => {
    return farms.filter((farm) => {
      const matchesSearch =
        !search ||
        farm.farmName.toLowerCase().includes(search.toLowerCase()) ||
        (farm.location?.name && farm.location.name.toLowerCase().includes(search.toLowerCase())) ||
        (farm.description && farm.description.toLowerCase().includes(search.toLowerCase()));

      const matchesType = selectedType === "ALL" || farm.farmType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [farms, search, selectedType]);

  const totalAreaSummary = useMemo(() => {
    let ropaniTotal = 0;
    farms.forEach((f) => {
      if (!f.area) return;
      if (f.areaUnit === "ROPANI") ropaniTotal += f.area;
      else if (f.areaUnit === "BIGHA") ropaniTotal += f.area * 13.31;
      else if (f.areaUnit === "HECTARE") ropaniTotal += f.area * 19.66;
      else if (f.areaUnit === "ACRE") ropaniTotal += f.area * 7.95;
      else if (f.areaUnit === "SQUARE_METER") ropaniTotal += f.area / 508.72;
    });
    return ropaniTotal.toFixed(1);
  }, [farms]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#DDF4EA] text-[#0F9F68]">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Farm Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Register and monitor your agricultural plots, land parcels, and GPS coordinates across Nepal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#0F9F68] hover:border-[#BCE9D5] transition-colors shadow-2xs cursor-pointer"
            title="Refresh farms"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#0F9F68]" : ""}`} />
          </button>

          <Button onClick={openCreateModal} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add New Farm</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Farms</p>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#171717] mt-2">{farms.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Active agricultural holdings</p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Combined Area</p>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#171717] mt-2">
            {totalAreaSummary} <span className="text-sm font-semibold text-gray-500">Ropani eq.</span>
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Across all registered parcels</p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Primary Location</p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#171717] mt-2 truncate">
            {farms[0]?.location?.name || "Unassigned Region"}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">District / Municipality tree</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search farm name, location, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0F9F68] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Filter by farm type"
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:border-[#0F9F68]"
          >
            <option value="ALL">All Farm Types</option>
            {FARM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadData} className="font-bold underline ml-2">
            Try again
          </button>
        </div>
      )}

      {/* Farm Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-100 rounded-md w-1/2" />
              <div className="h-24 bg-gray-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {search || selectedType !== "ALL" ? "No matching farms found" : "No farms registered yet"}
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {search || selectedType !== "ALL"
                ? "Try adjusting your search criteria or resetting filters."
                : "Add your first parcel to unlock tailored crop health recommendations and climate analytics."}
            </p>
          </div>
          {!search && selectedType === "ALL" && (
            <Button onClick={openCreateModal} className="mt-2">
              <Plus className="w-4 h-4 mr-1.5" />
              Register Your First Farm
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredFarms.map((farm, index) => (
            <div
              key={farm.id}
              className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-2xs hover:shadow-md hover:border-[#BCE9D5] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-[#0F9F68] transition-colors">
                        {farm.farmName}
                      </h3>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{farm.location?.name || "Location not assigned"}</span>
                      {farm.location?.type && (
                        <span className="text-[10px] text-gray-400">({farm.location.type})</span>
                      )}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200 shrink-0">
                    {farm.farmType?.replace("_", " ") || "FARM"}
                  </span>
                </div>

                {/* Area & Coordinates info */}
                <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Land Area</span>
                    <p className="font-bold text-gray-800 mt-0.5">
                      {farm.area ? `${farm.area} ${farm.areaUnit?.toLowerCase() || ""}` : "Unspecified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Coordinates</span>
                    <p className="font-bold text-gray-800 mt-0.5">
                      {farm.latitude && farm.longitude ? (
                        <a
                          href={`https://maps.google.com/?q=${farm.latitude},${farm.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0F9F68] hover:underline inline-flex items-center gap-1"
                        >
                          <span>
                            {farm.latitude.toFixed(3)}, {farm.longitude.toFixed(3)}
                          </span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400 font-normal">Not configured</span>
                      )}
                    </p>
                  </div>
                </div>

                {farm.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {farm.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(farm.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(farm)}
                    className="p-2 rounded-xl text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Edit farm details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingFarmId(farm.id)}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete farm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CREATE FARM MODAL ────────────────────────────────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">Register New Farm</h3>
                <p className="text-xs text-gray-500">Record a plot to link crop schedules and diagnosis.</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input
                label="Farm / Plot Name *"
                placeholder="e.g. Bhaktapur North Terrace"
                value={formFarmName}
                onChange={(e) => setFormFarmName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Region / Location</label>
                  <select
                    value={formLocationId}
                    onChange={(e) => setFormLocationId(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#0F9F68] focus:outline-none"
                  >
                    <option value="">Select district / region</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.nepaliName ? `(${loc.nepaliName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Farm Type</label>
                  <select
                    value={formFarmType}
                    onChange={(e) => setFormFarmType(e.target.value as FarmType)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#0F9F68] focus:outline-none"
                  >
                    {FARM_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Area Size"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 3.5"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Area Unit</label>
                  <select
                    value={formAreaUnit}
                    onChange={(e) => setFormAreaUnit(e.target.value as FarmAreaUnit)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#0F9F68] focus:outline-none"
                  >
                    {AREA_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coordinates */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">GPS Coordinates (Optional)</label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[11px] font-bold text-[#0F9F68] hover:underline inline-flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Auto-detect via GPS</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Latitude (e.g. 27.7172)"
                    value={formLatitude}
                    onChange={(e) => setFormLatitude(e.target.value)}
                  />
                  <Input
                    placeholder="Longitude (e.g. 85.3240)"
                    value={formLongitude}
                    onChange={(e) => setFormLongitude(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Field Notes / Description</label>
                <textarea
                  rows={3}
                  placeholder="Irrigation sources, soil texture notes, terrace layout..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#0F9F68] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} loadingText="Saving Farm...">
                  Register Farm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT FARM MODAL ──────────────────────────────────────────── */}
      {editingFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">Edit Farm Information</h3>
                <p className="text-xs text-gray-500">Update parcel coordinates and classification.</p>
              </div>
              <button
                onClick={() => setEditingFarm(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                label="Farm / Plot Name *"
                value={formFarmName}
                onChange={(e) => setFormFarmName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Region / Location</label>
                  <select
                    value={formLocationId}
                    onChange={(e) => setFormLocationId(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#0F9F68] focus:outline-none"
                  >
                    <option value="">Select district / region</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.nepaliName ? `(${loc.nepaliName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Farm Type</label>
                  <select
                    value={formFarmType}
                    onChange={(e) => setFormFarmType(e.target.value as FarmType)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#0F9F68] focus:outline-none"
                  >
                    {FARM_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Area Size"
                  type="number"
                  step="0.01"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Area Unit</label>
                  <select
                    value={formAreaUnit}
                    onChange={(e) => setFormAreaUnit(e.target.value as FarmAreaUnit)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#0F9F68] focus:outline-none"
                  >
                    {AREA_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">GPS Coordinates</label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[11px] font-bold text-[#0F9F68] hover:underline inline-flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Auto-detect via GPS</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Latitude"
                    value={formLatitude}
                    onChange={(e) => setFormLatitude(e.target.value)}
                  />
                  <Input
                    placeholder="Longitude"
                    value={formLongitude}
                    onChange={(e) => setFormLongitude(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Field Notes</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#0F9F68] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button variant="outline" type="button" onClick={() => setEditingFarm(null)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} loadingText="Updating...">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION DIALOG ───────────────────────────────── */}
      {deletingFarmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Remove Farm Parcel?</h3>
                <p className="text-xs text-gray-500">This action can be restored later.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete this farm? Existing diagnosis history and crops tied to this farm will remain in your archives.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeletingFarmId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(deletingFarmId)}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
