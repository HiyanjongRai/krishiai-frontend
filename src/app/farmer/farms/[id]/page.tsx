"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Sprout,
  Calendar,
  ClipboardList,
  BookOpen,
  Sparkles,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  MapPin,
  Layers,
  Search,
  RefreshCw,
  Loader2,
  ShieldAlert,
  Info,
  CalendarDays,
  FileText,
  Check,
  ChevronRight,
} from "lucide-react";
import { farmService } from "@/services/farm";
import {
  farmCropService,
  cropTaskService,
  cropJournalService,
  cropRecommendationService,
} from "@/services/farm/farmCropService";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FarmResponse } from "@/types/farm";
import type {
  FarmCropResponse,
  CropTaskResponse,
  CropJournalResponse,
  CropCareRecommendationResponse,
  GrowthStage,
  TaskStatus,
  TaskPriority,
  CreateFarmCropRequest,
  CreateCropTaskRequest,
  CreateCropJournalRequest,
} from "@/types/farmCrop";

// ── Constants ─────────────────────────────────────────────────────────────────

const GROWTH_STAGES: { value: GrowthStage; label: string; emoji: string; color: string }[] = [
  { value: "SEED", label: "Seed", emoji: "🌱", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "GERMINATION", label: "Germination", emoji: "🌿", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "SEEDLING", label: "Seedling", emoji: "🪴", color: "bg-lime-50 text-lime-700 border-lime-200" },
  { value: "VEGETATIVE", label: "Vegetative", emoji: "🍃", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { value: "FLOWERING", label: "Flowering", emoji: "🌸", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { value: "FRUITING", label: "Fruiting", emoji: "🍅", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "RIPENING", label: "Ripening", emoji: "🌾", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "HARVESTED", label: "Harvested", emoji: "✅", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

const TASK_PRIORITIES: { value: TaskPriority; label: string; badge: string }[] = [
  { value: "LOW", label: "Low", badge: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "MEDIUM", label: "Medium", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "HIGH", label: "High", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "URGENT", label: "Urgent", badge: "bg-red-50 text-red-700 border-red-200" },
];

function stageInfo(stage: GrowthStage) {
  return GROWTH_STAGES.find((s) => s.value === stage) || GROWTH_STAGES[0];
}

function priorityInfo(p: TaskPriority) {
  return TASK_PRIORITIES.find((x) => x.value === p) || TASK_PRIORITIES[1];
}

type Tab = "crops" | "tasks" | "journal" | "recommendations";

export default function FarmDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const farmId = Number(params?.id);

  const initialTab = (searchParams?.get("tab") as Tab) || "crops";
  const initialCropId = searchParams?.get("cropId") ? Number(searchParams.get("cropId")) : null;

  const [farm, setFarm] = useState<FarmResponse | null>(null);
  const [farmCrops, setFarmCrops] = useState<FarmCropResponse[]>([]);
  const [tasks, setTasks] = useState<CropTaskResponse[]>([]);
  const [journal, setJournal] = useState<CropJournalResponse[]>([]);
  const [recommendation, setRecommendation] = useState<CropCareRecommendationResponse | null>(null);
  const [selectedFarmCropId, setSelectedFarmCropId] = useState<number | null>(initialCropId);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showEditStageModal, setShowEditStageModal] = useState<FarmCropResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReco, setIsLoadingReco] = useState(false);

  // ── Master data catalog ────────────────────────────────────────────────────
  const [availableCrops, setAvailableCrops] = useState<{ id: number; name: string; emoji: string | null }[]>([]);
  const [cropSearch, setCropSearch] = useState("");

  // ── Add crop form ──────────────────────────────────────────────────────────
  const [addCropId, setAddCropId] = useState("");
  const [addCropLabel, setAddCropLabel] = useState("");
  const [addCropPlantDate, setAddCropPlantDate] = useState("");
  const [addCropHarvestDate, setAddCropHarvestDate] = useState("");
  const [addCropStage, setAddCropStage] = useState<GrowthStage>("SEED");
  const [addCropArea, setAddCropArea] = useState("");
  const [addCropNotes, setAddCropNotes] = useState("");

  // ── Task form ──────────────────────────────────────────────────────────────
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [taskCategory, setTaskCategory] = useState("CROP_CARE");
  const [taskFarmCropId, setTaskFarmCropId] = useState<number | null>(null);

  // ── Journal form ───────────────────────────────────────────────────────────
  const [journalDate, setJournalDate] = useState(new Date().toISOString().slice(0, 10));
  const [journalContent, setJournalContent] = useState("");
  const [journalWeather, setJournalWeather] = useState("");
  const [journalStage, setJournalStage] = useState<GrowthStage | "">("");
  const [journalFarmCropId, setJournalFarmCropId] = useState<number | null>(null);

  // ── Load farm & related data ───────────────────────────────────────────────
  const loadFarm = useCallback(async () => {
    if (!farmId) return;
    setIsLoading(true);
    try {
      const [farmData, cropsData, allTasks] = await Promise.all([
        farmService.getFarm(farmId),
        farmCropService.getCropsForFarm(farmId),
        cropTaskService.getAllTasks(),
      ]);
      setFarm(farmData);
      setFarmCrops(cropsData || []);
      setTasks((allTasks || []).filter((t) => t.farmId === farmId));

      // Auto-select crop for recommendations if requested via query param
      if (initialCropId && cropsData?.some((c) => c.id === initialCropId)) {
        setSelectedFarmCropId(initialCropId);
        loadRecommendation(initialCropId);
      } else if (cropsData?.length > 0 && !selectedFarmCropId) {
        setSelectedFarmCropId(cropsData[0].id);
      }
    } catch {
      toast.error({ title: "Failed to load farm details" });
    } finally {
      setIsLoading(false);
    }
  }, [farmId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadFarm();
  }, [loadFarm]);

  // Load master catalog when opening Add Crop modal
  useEffect(() => {
    if (showAddCropModal && availableCrops.length === 0) {
      import("@/services/master-data").then(({ masterDataService }) => {
        masterDataService
          .getCrops({ page: 0, size: 250 })
          .then((data) => {
            setAvailableCrops(
              data.content.map((c: { id: number; name: string; emoji?: string | null }) => ({
                id: c.id,
                name: c.name,
                emoji: c.emoji ?? null,
              }))
            );
          })
          .catch(() => {});
      });
    }
  }, [showAddCropModal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load journal when tab is active and crop is selected
  useEffect(() => {
    if (activeTab === "journal" && selectedFarmCropId) {
      cropJournalService
        .getJournal(selectedFarmCropId)
        .then((j) => setJournal(j || []))
        .catch(() => {});
    }
  }, [activeTab, selectedFarmCropId]);

  // ── Recommendations helper ─────────────────────────────────────────────────
  const loadRecommendation = async (cropId: number) => {
    setSelectedFarmCropId(cropId);
    setIsLoadingReco(true);
    setRecommendation(null);
    try {
      const reco = await cropRecommendationService.getRecommendation(cropId);
      setRecommendation(reco);
    } catch {
      toast.error({ title: "Could not generate AI recommendations" });
    } finally {
      setIsLoadingReco(false);
    }
  };

  // ── Crop Handlers ──────────────────────────────────────────────────────────
  const handleAddCrop = async () => {
    if (!addCropId) {
      toast.error({ title: "Please select a crop from catalog" });
      return;
    }
    setIsSubmitting(true);
    try {
      const req: CreateFarmCropRequest = {
        farmId,
        cropId: Number(addCropId),
        label: addCropLabel || undefined,
        plantingDate: addCropPlantDate || undefined,
        expectedHarvestDate: addCropHarvestDate || undefined,
        growthStage: addCropStage,
        areaPlanted: addCropArea ? Number(addCropArea) : undefined,
        notes: addCropNotes || undefined,
      };
      const created = await farmCropService.addCropToFarm(req);
      setFarmCrops((prev) => [created, ...prev]);
      setSelectedFarmCropId(created.id);
      setShowAddCropModal(false);
      resetAddCropForm();
      toast.success({ title: "Crop planted successfully!" });
    } catch {
      toast.error({ title: "Failed to add crop to farm" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStage = async (crop: FarmCropResponse, newStage: GrowthStage) => {
    try {
      const updated = await farmCropService.updateFarmCrop(crop.id, { growthStage: newStage });
      setFarmCrops((prev) => prev.map((c) => (c.id === crop.id ? updated : c)));
      setShowEditStageModal(null);
      toast.success({ title: `Growth stage updated to ${stageInfo(newStage).label}` });
      if (selectedFarmCropId === crop.id) {
        loadRecommendation(crop.id);
      }
    } catch {
      toast.error({ title: "Failed to update growth stage" });
    }
  };

  const handleRemoveCrop = async (cropId: number) => {
    if (!confirm("Are you sure you want to remove this crop from this farm?")) return;
    try {
      await farmCropService.removeCropFromFarm(cropId);
      setFarmCrops((prev) => prev.filter((c) => c.id !== cropId));
      if (selectedFarmCropId === cropId) setSelectedFarmCropId(null);
      toast.success({ title: "Crop removed from farm" });
    } catch {
      toast.error({ title: "Failed to remove crop" });
    }
  };

  // ── Task Handlers ──────────────────────────────────────────────────────────
  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      toast.error({ title: "Please enter a task title" });
      return;
    }
    const targetCropId = taskFarmCropId || selectedFarmCropId || farmCrops[0]?.id;
    if (!targetCropId) {
      toast.error({ title: "Please select a crop for this task" });
      return;
    }
    setIsSubmitting(true);
    try {
      const req: CreateCropTaskRequest = {
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        dueDate: taskDue || undefined,
        priority: taskPriority,
        category: taskCategory || "CROP_CARE",
      };
      const created = await cropTaskService.createTask(targetCropId, req);
      setTasks((prev) => [created, ...prev]);
      setShowTaskModal(false);
      resetTaskForm();
      toast.success({ title: "Care task scheduled!" });
    } catch {
      toast.error({ title: "Failed to create task" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (task: CropTaskResponse) => {
    const nextStatus: TaskStatus = task.status === "DONE" ? "PENDING" : "DONE";
    try {
      const updated = await cropTaskService.markTaskStatus(task.id, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      toast.success({
        title: nextStatus === "DONE" ? "Task marked as done! ✅" : "Task marked as pending",
      });
    } catch {
      toast.error({ title: "Failed to update task status" });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await cropTaskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success({ title: "Task deleted" });
    } catch {
      toast.error({ title: "Failed to delete task" });
    }
  };

  // ── Journal Handlers ───────────────────────────────────────────────────────
  const handleCreateJournal = async () => {
    if (!journalContent.trim()) {
      toast.error({ title: "Please write a journal entry" });
      return;
    }
    const targetCropId = journalFarmCropId || selectedFarmCropId || farmCrops[0]?.id;
    if (!targetCropId) {
      toast.error({ title: "Please select a crop for this entry" });
      return;
    }
    setIsSubmitting(true);
    try {
      const req: CreateCropJournalRequest = {
        entryDate: journalDate,
        content: journalContent.trim(),
        weatherNote: journalWeather.trim() || undefined,
        growthStageAtEntry: journalStage ? (journalStage as GrowthStage) : undefined,
      };
      const created = await cropJournalService.addJournalEntry(targetCropId, req);
      setJournal((prev) => [created, ...prev]);
      setShowJournalModal(false);
      resetJournalForm();
      toast.success({ title: "Journal entry recorded!" });
    } catch {
      toast.error({ title: "Failed to save journal entry" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJournal = async (journalId: number) => {
    try {
      await cropJournalService.deleteJournalEntry(journalId);
      setJournal((prev) => prev.filter((j) => j.id !== journalId));
      toast.success({ title: "Journal entry removed" });
    } catch {
      toast.error({ title: "Failed to delete entry" });
    }
  };

  // ── Reset helpers ──────────────────────────────────────────────────────────
  const resetAddCropForm = () => {
    setAddCropId("");
    setAddCropLabel("");
    setAddCropPlantDate("");
    setAddCropHarvestDate("");
    setAddCropStage("SEED");
    setAddCropArea("");
    setAddCropNotes("");
    setCropSearch("");
  };

  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskDesc("");
    setTaskDue("");
    setTaskPriority("MEDIUM");
    setTaskCategory("CROP_CARE");
    setTaskFarmCropId(null);
  };

  const resetJournalForm = () => {
    setJournalDate(new Date().toISOString().slice(0, 10));
    setJournalContent("");
    setJournalWeather("");
    setJournalStage("");
    setJournalFarmCropId(null);
  };

  const filteredCatalogCrops = availableCrops.filter((c) =>
    c.name.toLowerCase().includes(cropSearch.toLowerCase())
  );

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
        <p className="text-xs font-semibold text-[#6B7280]">Loading farm &amp; crop details...</p>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center max-w-lg mx-auto mt-8">
        <AlertTriangle className="w-10 h-10 text-[#F59E0B] mx-auto mb-2" />
        <h3 className="text-base font-bold text-[#1F2937]">Farm Not Found</h3>
        <p className="text-xs text-[#6B7280] mt-1">This farm may have been deleted or does not belong to your account.</p>
        <Link
          href="/farmer/farms"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Farms</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ─── 1. Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/farmer/farms"
            className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#1F2937] transition-colors shadow-2xs shrink-0"
            title="Back to My Farms"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight truncate">
                {farm.farmName}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] uppercase">
                {farm.farmType.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#6B7280] flex-wrap">
              {farm.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                  <span>{farm.location.name}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#9CA3AF]" />
                <span>
                  {farm.area} {farm.areaUnit.toLowerCase()}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Sprout className="w-3 h-3 text-[#2E7D32]" />
                <span className="font-semibold text-[#1F2937]">
                  {farmCrops.length} crop{farmCrops.length !== 1 ? "s" : ""}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadFarm}
            className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] transition-colors shadow-2xs"
            title="Refresh details"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowAddCropModal(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Crop to Farm</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Segmented Tab Navigation ────────────────────────────────────── */}
      <div className="bg-white p-1.5 rounded-2xl border border-[#E5E7EB] shadow-2xs flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("crops")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "crops"
              ? "bg-[#2E7D32] text-white shadow-2xs"
              : "text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]"
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>Planted Crops</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "crops" ? "bg-white/20 text-white" : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            {farmCrops.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tasks"
              ? "bg-[#2E7D32] text-white shadow-2xs"
              : "text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Care Tasks</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "tasks" ? "bg-white/20 text-white" : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            {tasks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("journal")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "journal"
              ? "bg-[#2E7D32] text-white shadow-2xs"
              : "text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Field Journal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("recommendations");
            if (selectedFarmCropId && !recommendation) {
              loadRecommendation(selectedFarmCropId);
            }
          }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "recommendations"
              ? "bg-[#2E7D32] text-white shadow-2xs"
              : "text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Crop Care</span>
        </button>
      </div>

      {/* ─── 3. TAB 1: PLANTED CROPS ─────────────────────────────────────────── */}
      {activeTab === "crops" && (
        <div className="space-y-3">
          {farmCrops.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto mb-3">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">No crops planted on this plot yet</h3>
              <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
                Add your first crop to track growth stages, schedule care tasks, and receive localized AI recommendations.
              </p>
              <button
                type="button"
                onClick={() => setShowAddCropModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Crop</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmCrops.map((fc) => {
                const stage = stageInfo(fc.growthStage);
                const isSelected = selectedFarmCropId === fc.id;
                return (
                  <div
                    key={fc.id}
                    className={`bg-white rounded-2xl border transition-all p-4.5 shadow-2xs flex flex-col justify-between ${
                      isSelected ? "border-[#2E7D32] ring-2 ring-[#2E7D32]/10" : "border-[#E5E7EB] hover:border-[#A5D6A7]"
                    }`}
                  >
                    <div>
                      {/* Top bar with stage badge & actions */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${stage.color}`}>
                          <span>{stage.emoji}</span>
                          <span>{stage.label}</span>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setShowEditStageModal(fc)}
                            className="p-1 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937] transition-colors"
                            title="Update growth stage"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCrop(fc.id)}
                            className="p-1 rounded-lg border border-[#E5E7EB] hover:bg-[#FEE2E2] text-[#6B7280] hover:text-[#DC2626] transition-colors"
                            title="Remove crop"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Crop info */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-2xl flex items-center justify-center shrink-0 border border-[#C8E6C9]">
                          {fc.crop?.emoji || "🌱"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[#1F2937] text-sm sm:text-base leading-tight truncate">
                            {fc.crop?.name}
                          </h3>
                          {fc.crop?.nepaliName && (
                            <p className="text-[11px] text-[#6B7280] truncate font-medium">
                              {fc.crop.nepaliName}
                            </p>
                          )}
                          {fc.label && (
                            <p className="text-[10px] text-[#2E7D32] bg-[#F1F8E9] px-2 py-0.5 rounded-md inline-block mt-1 font-semibold truncate max-w-full">
                              🏷️ {fc.label}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Cultivation details */}
                      <div className="mt-3.5 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-xs">
                        <div>
                          <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
                            Planted Date
                          </span>
                          <span className="text-[11px] font-semibold text-[#374151] flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-[#9CA3AF]" />
                            {fc.plantingDate || "Not recorded"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
                            Area
                          </span>
                          <span className="text-[11px] font-semibold text-[#374151] flex items-center gap-1 mt-0.5">
                            <Layers className="w-3 h-3 text-[#9CA3AF]" />
                            {fc.areaPlanted ? `${fc.areaPlanted} ${farm.areaUnit.toLowerCase()}` : "Whole plot"}
                          </span>
                        </div>
                      </div>

                      {fc.notes && (
                        <p className="mt-2 text-[11px] text-[#6B7280] line-clamp-2 italic bg-[#F9FAFB] p-2 rounded-lg border border-[#F3F4F6]">
                          &ldquo;{fc.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-[#EEF0EE] grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFarmCropId(fc.id);
                          setTaskFarmCropId(fc.id);
                          setActiveTab("tasks");
                          setShowTaskModal(true);
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-semibold transition-colors"
                      >
                        <ClipboardList className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Task</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFarmCropId(fc.id);
                          setJournalFarmCropId(fc.id);
                          setActiveTab("journal");
                          setShowJournalModal(true);
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-semibold transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Log</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("recommendations");
                          loadRecommendation(fc.id);
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] text-xs font-semibold transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI Care</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── 4. TAB 2: TASKS ─────────────────────────────────────────────────── */}
      {activeTab === "tasks" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Care Activities &amp; Reminders</h3>
              <p className="text-[11px] text-[#6B7280]">Scheduled operations for crops planted on this farm.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTaskModal(true)}
              disabled={farmCrops.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Task</span>
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-10 text-center">
              <ClipboardList className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[#1F2937]">No care tasks yet</h4>
              <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
                Schedule irrigation, fertilization, scouting, or harvesting tasks to keep your crops on schedule.
              </p>
              {farmCrops.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTaskModal(true)}
                  className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Task</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => {
                const priority = priorityInfo(t.priority);
                const isDone = t.status === "DONE";
                return (
                  <div
                    key={t.id}
                    className={`bg-white rounded-2xl border transition-all p-3.5 shadow-2xs flex items-center justify-between gap-3 ${
                      isDone ? "border-[#E5E7EB] opacity-65 bg-[#F9FAFB]" : "border-[#E5E7EB] hover:border-[#C8E6C9]"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(t)}
                        className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isDone
                            ? "bg-[#2E7D32] border-[#2E7D32] text-white"
                            : "border-[#D1D5DB] hover:border-[#2E7D32] bg-white"
                        }`}
                        title={isDone ? "Mark as pending" : "Mark as completed"}
                      >
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-xs sm:text-sm font-bold truncate ${isDone ? "line-through text-[#9CA3AF]" : "text-[#1F2937]"}`}>
                            {t.title}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${priority.badge}`}>
                            {priority.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-[11px] text-[#6B7280] mt-1 flex-wrap">
                          {t.cropName && (
                            <span className="inline-flex items-center gap-1 font-semibold text-[#2E7D32]">
                              <span>{t.cropEmoji || "🌱"}</span>
                              <span>{t.cropName}</span>
                            </span>
                          )}
                          {t.dueDate && (
                            <span className="flex items-center gap-1 text-[#9CA3AF]">
                              <Clock className="w-3 h-3" />
                              <span>{t.dueDate}</span>
                            </span>
                          )}
                          {t.category && (
                            <span className="text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.2 rounded">
                              {t.category.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>

                        {t.description && (
                          <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-1">
                            {t.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-1.5 rounded-lg border border-transparent hover:border-[#FEE2E2] hover:bg-[#FEE2E2] text-[#9CA3AF] hover:text-[#DC2626] transition-colors shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. TAB 3: FIELD JOURNAL ─────────────────────────────────────────── */}
      {activeTab === "journal" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#1F2937]">Crop Plot:</span>
              <select
                value={selectedFarmCropId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedFarmCropId(id || null);
                }}
                className="text-xs bg-white border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 font-semibold text-[#1F2937] focus:outline-none focus:border-[#2E7D32]"
              >
                {farmCrops.map((fc) => (
                  <option key={fc.id} value={fc.id}>
                    {fc.crop?.emoji || "🌱"} {fc.crop?.name} {fc.label ? `(${fc.label})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowJournalModal(true)}
              disabled={!selectedFarmCropId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Observation</span>
            </button>
          </div>

          {journal.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-10 text-center">
              <BookOpen className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[#1F2937]">No journal logs recorded yet</h4>
              <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
                Record flowering dates, fertilizer applications, pest observations, or weather impacts.
              </p>
              <button
                type="button"
                onClick={() => setShowJournalModal(true)}
                disabled={!selectedFarmCropId}
                className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-[#2E7D32] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write First Log</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {journal.map((j) => (
                <div key={j.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {j.entryDate}
                      </span>
                      {j.growthStageAtEntry && (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                          {stageInfo(j.growthStageAtEntry).emoji} {stageInfo(j.growthStageAtEntry).label}
                        </span>
                      )}
                      {j.weatherNote && (
                        <span className="text-[11px] text-[#6B7280] italic">
                          🌤️ {j.weatherNote}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteJournal(j.id)}
                      className="p-1 rounded-lg border border-transparent hover:border-[#FEE2E2] hover:bg-[#FEE2E2] text-[#9CA3AF] hover:text-[#DC2626] transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">
                    {j.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 6. TAB 4: AI SMART RECOMMENDATIONS ──────────────────────────────── */}
      {activeTab === "recommendations" && (
        <div className="space-y-4">
          {/* Crop selector pills */}
          <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-2">
              Select Crop for AI Analysis
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {farmCrops.map((fc) => (
                <button
                  key={fc.id}
                  type="button"
                  onClick={() => loadRecommendation(fc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedFarmCropId === fc.id
                      ? "bg-[#2E7D32] text-white shadow-2xs"
                      : "bg-[#F8FAF8] border border-[#E5E7EB] text-[#4B5563] hover:bg-white"
                  }`}
                >
                  <span>{fc.crop?.emoji || "🌱"}</span>
                  <span>{fc.crop?.name}</span>
                  {fc.label && <span className="opacity-75">({fc.label})</span>}
                </button>
              ))}
            </div>
          </div>

          {isLoadingReco && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">Synthesizing Crop Care Intelligence...</h3>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                Correlating current growth stage, soil type, and local weather forecasts to compute stage precautions and schedules.
              </p>
            </div>
          )}

          {recommendation && !isLoadingReco && (
            <div className="space-y-4">
              {/* Header Banner */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4.5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-2xl flex items-center justify-center shrink-0 border border-[#C8E6C9]">
                    {recommendation.cropEmoji || "🌱"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#1F2937]">
                        {recommendation.cropName} Care Guidance
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Stage: <span className="font-semibold text-[#1F2937]">{recommendation.growthStage.replace(/_/g, " ")}</span>
                      {recommendation.plantingDateInfo && ` • ${recommendation.plantingDateInfo}`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => selectedFarmCropId && loadRecommendation(selectedFarmCropId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Analysis</span>
                </button>
              </div>

              {/* Recommendation Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {recommendation.sections.map((sec, i) => {
                  const isHigh = sec.urgency === "NOW" || sec.urgency === "THIS_WEEK";
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl border p-4 shadow-2xs space-y-2 flex flex-col justify-between ${
                        isHigh
                          ? "bg-[#FFFBEB] border-[#FDE68A]"
                          : "bg-white border-[#E5E7EB]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{sec.icon}</span>
                            <h4 className="text-xs sm:text-sm font-bold text-[#1F2937]">{sec.title}</h4>
                          </div>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isHigh
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {sec.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-[#4B5563] mt-2 leading-relaxed whitespace-pre-wrap">
                          {sec.detail}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E5E7EB]/60 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setTaskTitle(sec.title);
                            setTaskDesc(sec.detail);
                            setTaskPriority(isHigh ? "HIGH" : "MEDIUM");
                            setTaskFarmCropId(selectedFarmCropId);
                            setActiveTab("tasks");
                            setShowTaskModal(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] hover:underline cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Schedule as Task</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Narrative */}
              {recommendation.aiNarrative && (
                <div className="bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4.5 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-[#166534]">
                      AI Agronomist Synthesis {recommendation.aiAvailable ? "" : "(Offline Safe Mode)"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                    {recommendation.aiNarrative}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL: ADD CROP TO FARM ─────────────────────────────────────────── */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
                  <Sprout className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#1F2937]">Plant Crop in Farm</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddCropModal(false);
                  resetAddCropForm();
                }}
                className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#1F2937]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Crop selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#374151]">Select Crop *</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter crop list..."
                  value={cropSearch}
                  onChange={(e) => setCropSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1 rounded-xl border border-[#E5E7EB] p-1.5 scrollbar-thin">
                {filteredCatalogCrops.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] text-center py-3">No matching crops</p>
                ) : (
                  filteredCatalogCrops.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAddCropId(String(c.id))}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                        addCropId === String(c.id)
                          ? "bg-[#2E7D32] text-white"
                          : "hover:bg-[#F3F4F6] text-[#374151]"
                      }`}
                    >
                      <span className="text-base">{c.emoji || "🌱"}</span>
                      <span>{c.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Plot / Variety Label (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. North Plot or Manakamana-3"
                  value={addCropLabel}
                  onChange={(e) => setAddCropLabel(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Growth Stage</label>
                <select
                  value={addCropStage}
                  onChange={(e) => setAddCropStage(e.target.value as GrowthStage)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                >
                  {GROWTH_STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.emoji} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Planting Date</label>
                <input
                  type="date"
                  value={addCropPlantDate}
                  onChange={(e) => setAddCropPlantDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Expected Harvest Date</label>
                <input
                  type="date"
                  value={addCropHarvestDate}
                  onChange={(e) => setAddCropHarvestDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#374151]">
                  Cultivated Area ({farm.areaUnit.toLowerCase()})
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2.5"
                  value={addCropArea}
                  onChange={(e) => setAddCropArea(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151]">Notes &amp; Observations (optional)</label>
              <textarea
                placeholder="Soil preparation, seed variety, spacing, or special conditions..."
                value={addCropNotes}
                onChange={(e) => setAddCropNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none resize-none h-18"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => {
                  setShowAddCropModal(false);
                  resetAddCropForm();
                }}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCrop}
                disabled={isSubmitting || !addCropId}
                className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Planting..." : "Plant Crop"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: UPDATE GROWTH STAGE ──────────────────────────────────────── */}
      {showEditStageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#1F2937]">Update Growth Stage</h3>
              <button
                type="button"
                onClick={() => setShowEditStageModal(null)}
                className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6B7280]">
              Select new stage for <strong className="text-[#1F2937]">{showEditStageModal.crop?.name}</strong>:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {GROWTH_STAGES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleUpdateStage(showEditStageModal, s.value)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                    showEditStageModal.growthStage === s.value
                      ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                      : "bg-[#F8FAF8] border-[#E5E7EB] text-[#374151] hover:bg-white hover:border-[#2E7D32]"
                  }`}
                >
                  <span className="text-base">{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE TASK ──────────────────────────────────────────────── */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
                  <ClipboardList className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#1F2937]">Schedule Crop Care Task</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTaskModal(false);
                  resetTaskForm();
                }}
                className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#1F2937]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Applicable Crop *</label>
                <select
                  value={taskFarmCropId || selectedFarmCropId || farmCrops[0]?.id || ""}
                  onChange={(e) => setTaskFarmCropId(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                >
                  {farmCrops.map((fc) => (
                    <option key={fc.id} value={fc.id}>
                      {fc.crop?.emoji || "🌱"} {fc.crop?.name} {fc.label ? `(${fc.label})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Apply Neem oil spray for aphids"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#374151]">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                  >
                    {TASK_PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#374151]">Due Date</label>
                  <input
                    type="date"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Description &amp; Instructions (optional)</label>
                <textarea
                  placeholder="Dosage, water volume, or instructions..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none resize-none h-18"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => {
                  setShowTaskModal(false);
                  resetTaskForm();
                }}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTask}
                disabled={isSubmitting || !taskTitle.trim()}
                className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE JOURNAL ───────────────────────────────────────────── */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#1F2937]">Log Field Observation</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowJournalModal(false);
                  resetJournalForm();
                }}
                className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#1F2937]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#374151]">Date</label>
                  <input
                    type="date"
                    value={journalDate}
                    onChange={(e) => setJournalDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#374151]">Observed Stage (optional)</label>
                  <select
                    value={journalStage}
                    onChange={(e) => setJournalStage(e.target.value as GrowthStage)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                  >
                    <option value="">Current stage</option>
                    {GROWTH_STAGES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.emoji} {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Weather Note (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sunny morning, afternoon shower"
                  value={journalWeather}
                  onChange={(e) => setJournalWeather(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">Observation &amp; Notes *</label>
                <textarea
                  placeholder="Observed shoot emergence, applied compost, irrigation notes, leaf color..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none resize-none h-24"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => {
                  setShowJournalModal(false);
                  resetJournalForm();
                }}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateJournal}
                disabled={isSubmitting || !journalContent.trim()}
                className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Log"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
