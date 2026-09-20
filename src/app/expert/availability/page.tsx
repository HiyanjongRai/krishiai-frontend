"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = (typeof DAYS)[number];

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

type WeekSchedule = Record<Day, { enabled: boolean; slots: TimeSlot[] }>;

const DEFAULT_SCHEDULE: WeekSchedule = {
  Monday: { enabled: true, slots: [{ id: "m1", startTime: "09:00", endTime: "12:00" }, { id: "m2", startTime: "14:00", endTime: "17:00" }] },
  Tuesday: { enabled: true, slots: [{ id: "t1", startTime: "09:00", endTime: "12:00" }] },
  Wednesday: { enabled: false, slots: [] },
  Thursday: { enabled: true, slots: [{ id: "th1", startTime: "10:00", endTime: "13:00" }, { id: "th2", startTime: "15:00", endTime: "18:00" }] },
  Friday: { enabled: true, slots: [{ id: "f1", startTime: "09:00", endTime: "12:00" }] },
  Saturday: { enabled: false, slots: [] },
  Sunday: { enabled: false, slots: [] },
};

export default function ExpertAvailabilityPage() {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE);

  const toggleDay = (day: Day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: !prev[day].enabled && prev[day].slots.length === 0
          ? [{ id: `${day}-${Date.now()}`, startTime: "09:00", endTime: "12:00" }]
          : prev[day].slots,
      },
    }));
  };

  const addSlot = (day: Day) => {
    const newSlot: TimeSlot = {
      id: `${day}-${Date.now()}`,
      startTime: "09:00",
      endTime: "17:00",
    };
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], slots: [...prev[day].slots, newSlot] },
    }));
  };

  const removeSlot = (day: Day, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((s) => s.id !== slotId),
      },
    }));
  };

  const updateSlot = (day: Day, slotId: string, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((s) => (s.id === slotId ? { ...s, [field]: value } : s)),
      },
    }));
  };

  const handleSave = () => {
    toast.warning({
      title: "Availability save unavailable",
      description: "This page is not connected to an expert availability API yet.",
    });
  };

  const activeDaysCount = DAYS.filter((d) => schedule[d].enabled).length;
  const totalSlotsCount = DAYS.reduce((acc, d) => acc + schedule[d].slots.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">Expert Workspace</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1F2937]">Availability Schedule</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4B5563]">
            Set the days and time windows when farmers can book consultations with you.
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="w-full sm:w-auto"
        >
          <Calendar className="w-4 h-4" />
          Save Availability
        </Button>
      </header>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border border-[#A5D6A7] bg-[#E8F5E9] p-3.5 sm:p-4">
          <p className="text-[11px] font-medium text-[#2E7D32]">Active Days</p>
          <p className="text-xl sm:text-2xl font-bold text-[#1B5E20] mt-1">{activeDaysCount} <span className="text-sm font-normal text-[#2E7D32]">/ 7</span></p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4">
          <p className="text-[11px] font-medium text-[#6B7280]">Total Time Slots</p>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">{totalSlotsCount}</p>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-xs">
        <button className="p-1.5 rounded-lg hover:bg-[#F1F5F2] text-[#6B7280] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
          <Clock className="w-4 h-4 text-[#2E7D32]" />
          <span>Weekly Recurring Schedule</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-[#F1F5F2] text-[#6B7280] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-by-Day Schedule */}
      <div className="space-y-3">
        {DAYS.map((day, idx) => {
          const dayData = schedule[day];
          const shortDay = SHORT_DAYS[idx];

          return (
            <div
              key={day}
              className={`rounded-xl border bg-white shadow-xs overflow-hidden transition-all ${
                dayData.enabled ? "border-[#A5D6A7]" : "border-[#E5E7EB] opacity-70"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between px-4 py-3 sm:py-3.5 border-b border-[#EEF0EE]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      dayData.enabled
                        ? "bg-[#2E7D32] text-white"
                        : "bg-[#F1F5F2] text-[#6B7280]"
                    }`}
                  >
                    {shortDay}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1F2937]">{day}</p>
                    <p className="text-[11px] text-[#6B7280]">
                      {dayData.enabled
                        ? dayData.slots.length === 0
                          ? "No slots added"
                          : `${dayData.slots.length} slot${dayData.slots.length !== 1 ? "s" : ""}`
                        : "Unavailable"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleDay(day)}
                  className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#2E7D32] transition-colors"
                  aria-label={`${dayData.enabled ? "Disable" : "Enable"} ${day}`}
                >
                  {dayData.enabled ? (
                    <ToggleRight className="w-7 h-7 text-[#2E7D32]" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-[#9CA3AF]" />
                  )}
                </button>
              </div>

              {/* Slots */}
              {dayData.enabled && (
                <div className="px-4 py-3 space-y-2.5">
                  {dayData.slots.map((slot) => (
                    <div key={slot.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-1.5 flex-1">
                          <label className="text-[11px] font-medium text-[#6B7280] w-8 shrink-0">From</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(day, slot.id, "startTime", e.target.value)}
                            className="flex-1 px-2.5 py-2 text-xs sm:text-sm rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-[#2E7D32] min-h-[40px]"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 flex-1">
                          <label className="text-[11px] font-medium text-[#6B7280] w-5 shrink-0">To</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(day, slot.id, "endTime", e.target.value)}
                            className="flex-1 px-2.5 py-2 text-xs sm:text-sm rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-[#2E7D32] min-h-[40px]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeSlot(day, slot.id)}
                        className="self-end sm:self-auto p-2 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label="Remove slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addSlot(day)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#A5D6A7] bg-[#E8F5E9] py-2 text-xs font-semibold text-[#2E7D32] hover:border-[#C8E6C9] hover:bg-[#E8F5E9] transition-colors mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Time Slot
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Footer */}
      <div className="pt-2 pb-4">
        <Button
          onClick={handleSave}
          className="w-full min-h-[48px]"
        >
          <Calendar className="w-4 h-4" />
          Save Availability Schedule
        </Button>
      </div>
    </div>
  );
}
