"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

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
  const [schedule, setSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE);
  const [saved, setSaved] = useState(false);

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
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activeDaysCount = DAYS.filter((d) => schedule[d].enabled).length;
  const totalSlotsCount = DAYS.reduce((acc, d) => acc + schedule[d].slots.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Expert Workspace</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Availability Schedule</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Set the days and time windows when farmers can book consultations with you.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all w-full sm:w-auto min-h-[42px] ${
            saved
              ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
              : "bg-emerald-700 hover:bg-emerald-800 text-white"
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
          {saved ? "Schedule Saved!" : "Save Availability"}
        </button>
      </header>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 sm:p-4">
          <p className="text-[11px] font-medium text-emerald-700">Active Days</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">{activeDaysCount} <span className="text-sm font-normal text-emerald-600">/ 7</span></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4">
          <p className="text-[11px] font-medium text-slate-500">Total Time Slots</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalSlotsCount}</p>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Weekly Recurring Schedule</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
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
                dayData.enabled ? "border-emerald-200" : "border-slate-200 opacity-70"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between px-4 py-3 sm:py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      dayData.enabled
                        ? "bg-emerald-700 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {shortDay}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{day}</p>
                    <p className="text-[11px] text-slate-500">
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
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 transition-colors"
                  aria-label={`${dayData.enabled ? "Disable" : "Enable"} ${day}`}
                >
                  {dayData.enabled ? (
                    <ToggleRight className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-300" />
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
                          <label className="text-[11px] font-medium text-slate-500 w-8 shrink-0">From</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(day, slot.id, "startTime", e.target.value)}
                            className="flex-1 px-2.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-emerald-500 min-h-[40px]"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 flex-1">
                          <label className="text-[11px] font-medium text-slate-500 w-5 shrink-0">To</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(day, slot.id, "endTime", e.target.value)}
                            className="flex-1 px-2.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-emerald-500 min-h-[40px]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeSlot(day, slot.id)}
                        className="self-end sm:self-auto p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label="Remove slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addSlot(day)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/50 py-2 text-xs font-semibold text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors mt-1"
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
        <button
          onClick={handleSave}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-xs transition-all min-h-[48px] ${
            saved
              ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
              : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
          {saved ? "Schedule Saved!" : "Save Availability Schedule"}
        </button>
      </div>
    </div>
  );
}
