/**
 * Expert Experience Page
 * Allows experts to manage their work experience information
 */

"use client";

import React, { useState } from "react";
import { ChevronLeft, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { EmptyState } from "@/components/ui/empty-state";

interface ExperienceEntry {
  id: string;
  organizationName: string;
  position: string;
  startYear: number;
  endYear: number | null;
  isCurrent: boolean;
  description: string;
}

export default function ExpertExperiencePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [yearsOfExperience, setYearsOfExperience] = useState(5);

  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    {
      id: "1",
      organizationName: "Ministry of Agriculture & Livestock Development",
      position: "Senior Agricultural Officer",
      startYear: 2019,
      endYear: null,
      isCurrent: true,
      description:
        "Led agricultural extension programs and provided technical guidance to farmers.",
    },
    {
      id: "2",
      organizationName: "Nepal Agricultural Research Council",
      position: "Research Associate",
      startYear: 2016,
      endYear: 2018,
      isCurrent: false,
      description:
        "Conducted research on crop improvement and sustainable farming practices.",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExperience, setNewExperience] = useState<Partial<ExperienceEntry>>({
    organizationName: "",
    position: "",
    startYear: new Date().getFullYear(),
    endYear: null,
    isCurrent: true,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddExperience = () => {
    const newErrors: Record<string, string> = {};

    if (!newExperience.organizationName?.trim())
      newErrors.organizationName = "Organization name is required";
    if (!newExperience.position?.trim()) newErrors.position = "Position is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const entry: ExperienceEntry = {
      id: Date.now().toString(),
      organizationName: newExperience.organizationName || "",
      position: newExperience.position || "",
      startYear: newExperience.startYear || new Date().getFullYear(),
      endYear: newExperience.isCurrent ? null : newExperience.endYear ?? null,
      isCurrent: newExperience.isCurrent || false,
      description: newExperience.description || "",
    };

    setExperiences([...experiences, entry]);
    setNewExperience({
      organizationName: "",
      position: "",
      startYear: new Date().getFullYear(),
      endYear: null,
      isCurrent: true,
      description: "",
    });
    setShowAddForm(false);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      toast.warning({
        title: "Experience save unavailable",
        description: "This page is not connected to an expert experience API yet.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/expert/profile" className="p-2 hover:bg-[#F1F5F2] rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#4B5563]" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Work Experience</h1>
          <p className="text-[#4B5563] mt-1">
            Manage your professional work experience and career history
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (isEditing) {
              setYearsOfExperience(5);
            }
          }}
          className={`ml-auto px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            isEditing
              ? "bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#1F2937]"
              : "bg-[#2E7D32] hover:bg-[#2E7D32] text-white"
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit
            </>
          )}
        </button>
      </div>

      {/* Years of Experience Card */}
      <div className="bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-[#93C5FD] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#2563EB] mb-2">
              Total Years of Experience
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={yearsOfExperience}
                onChange={(e) =>
                  isEditing && setYearsOfExperience(parseInt(e.target.value) || 0)
                }
                disabled={!isEditing}
                min="0"
                className={`flex-1 px-4 py-3 rounded-lg font-bold text-2xl text-center border-2 ${
                  isEditing
                    ? "border-[#93C5FD] bg-white text-[#2563EB]"
                    : "border-[#93C5FD] bg-[#DBEAFE] text-[#2563EB] cursor-not-allowed"
                }`}
              />
              <span className="text-xl font-semibold text-[#2563EB]">years</span>
            </div>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-[#2563EB]">
              Your total experience helps verify your expertise and credibility on the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Experience List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1F2937]">Work History</h2>
          {isEditing && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#2E7D32] text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          )}
        </div>

        {/* Add Experience Form */}
        {showAddForm && isEditing && (
          <div className="bg-[#F8FAF8] rounded-2xl p-6 mb-6 border border-[#E5E7EB]">
            <h3 className="font-semibold text-[#1F2937] mb-4">Add Work Experience</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  Organization Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={newExperience.organizationName || ""}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, organizationName: e.target.value })
                  }
                  placeholder="E.g., Ministry of Agriculture"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                    errors.organizationName
                      ? "border-[#FCA5A5]0 bg-[#FEE2E2]"
                      : "border-[#D1D5DB] bg-white"
                  }`}
                />
                <FieldError>{errors.organizationName}</FieldError>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  Position <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={newExperience.position || ""}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, position: e.target.value })
                  }
                  placeholder="E.g., Senior Agricultural Officer"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                    errors.position
                      ? "border-[#FCA5A5]0 bg-[#FEE2E2]"
                      : "border-[#D1D5DB] bg-white"
                  }`}
                />
                <FieldError>{errors.position}</FieldError>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                    Start Year
                  </label>
                  <input
                    type="number"
                    value={newExperience.startYear || new Date().getFullYear()}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        startYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D1D5DB] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                    End Year
                  </label>
                  <input
                    type="number"
                    value={newExperience.isCurrent ? "" : newExperience.endYear || ""}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        endYear: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    disabled={newExperience.isCurrent}
                    placeholder="Current role?"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D1D5DB] bg-white disabled:bg-[#F1F5F2] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={newExperience.isCurrent || false}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, isCurrent: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-[#D1D5DB] text-[#2E7D32]"
                />
                <label htmlFor="isCurrent" className="text-sm font-medium text-[#1F2937]">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  Description
                </label>
                <textarea
                  value={newExperience.description || ""}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, description: e.target.value })
                  }
                  placeholder="Describe your responsibilities and achievements"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D1D5DB] bg-white resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddExperience}
                className="flex-1 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#2E7D32] text-white rounded-lg font-semibold transition-colors"
              >
                Add Experience
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewExperience({
                    organizationName: "",
                    position: "",
                    startYear: new Date().getFullYear(),
                    isCurrent: true,
                    description: "",
                  });
                  setErrors({});
                }}
                className="flex-1 px-4 py-2.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#1F2937] rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Experience Cards */}
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <EmptyState
              title="No experience added yet"
              description="Add your work history so administrators can understand your field background."
              actionLabel={isEditing ? "Add First Experience" : undefined}
              onAction={isEditing ? () => setShowAddForm(true) : undefined}
            />
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="border border-[#E5E7EB] rounded-xl p-4 hover:border-[#D1D5DB] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-[#1F2937]">{exp.position}</div>
                    <div className="text-[#4B5563] text-sm">{exp.organizationName}</div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      {exp.startYear} –{" "}
                      {exp.isCurrent ? "Present" : exp.endYear}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-[#4B5563] mt-2">{exp.description}</p>
                    )}
                    {exp.isCurrent && (
                      <div className="inline-block mt-2 px-2 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold rounded">
                        Current Role
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 text-[#9CA3AF] hover:text-[#DC2626] transition-colors flex-shrink-0"
                      title="Delete experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Checking..."
              className="flex-1"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#1F2937] font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
