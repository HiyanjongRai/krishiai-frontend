/**
 * Expert Professional Qualification Page
 * Allows experts to manage their professional qualifications
 */

"use client";

import React, { useState } from "react";
import { ChevronLeft, Edit2, Save, X } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";

interface ProfessionalFormData {
  qualification: string;
  institution: string;
  graduationYear: number;
  specialization: string;
  professionalBio: string;
}

export default function ExpertProfessionalPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<ProfessionalFormData>({
    qualification: "B.Sc. Agriculture",
    institution: "Tribhuwan University",
    graduationYear: 2018,
    specialization: "Crop Specialist",
    professionalBio:
      "I am an experienced agricultural specialist with a passion for helping farmers improve their yields through sustainable farming practices. My expertise spans vegetable cultivation, soil management, and integrated pest management.",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof ProfessionalFormData,
    value: ProfessionalFormData[keyof ProfessionalFormData]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.institution.trim()) newErrors.institution = "Institution is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      toast.warning({
        title: "Profile save unavailable",
        description: "This page is not connected to the expert profile update API yet.",
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
          <h1 className="text-3xl font-bold text-[#1F2937]">Professional Qualification</h1>
          <p className="text-[#4B5563] mt-1">
            Manage your qualifications and professional background
          </p>
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              setFormData({
                qualification: "B.Sc. Agriculture",
                institution: "Tribhuwan University",
                graduationYear: 2018,
                specialization: "Crop Specialist",
                professionalBio:
                  "I am an experienced agricultural specialist with a passion for helping farmers improve their yields through sustainable farming practices. My expertise spans vegetable cultivation, soil management, and integrated pest management.",
              });
              setErrors({});
            }
            setIsEditing(!isEditing);
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

      {/* Form */}
      <div className="space-y-6">
        {/* Qualification Section */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="text-xl font-bold text-[#1F2937] mb-6">Education & Qualification</h2>

          <div className="space-y-6">
            {/* Qualification */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Qualification <span className="text-[#DC2626]">*</span>
              </label>
              <select
                value={formData.qualification}
                onChange={(e) => handleInputChange("qualification", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                  errors.qualification
                    ? "border-[#FCA5A5]0 bg-[#FEE2E2]"
                    : "border-[#D1D5DB] bg-[#F8FAF8]"
                } ${!isEditing ? "text-[#4B5563] cursor-not-allowed" : "text-[#1F2937]"}`}
              >
                <option value="">Select qualification</option>
                <option value="JTA">JTA</option>
                <option value="B.Sc. Agriculture">B.Sc. Agriculture</option>
                <option value="B.Tech Agriculture">B.Tech Agriculture</option>
                <option value="Agronomist">Agronomist</option>
                <option value="Other">Other</option>
              </select>
              <FieldError>{errors.qualification}</FieldError>
            </div>

            {/* Institution & Graduation Year - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  Institution <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                  placeholder="E.g., Tribhuwan University"
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                    errors.institution
                      ? "border-[#FCA5A5]0 bg-[#FEE2E2]"
                      : "border-[#D1D5DB] bg-[#F8FAF8]"
                  } ${!isEditing ? "text-[#4B5563] cursor-not-allowed" : "text-[#1F2937]"}`}
                />
                <FieldError>{errors.institution}</FieldError>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) =>
                    handleInputChange("graduationYear", parseInt(e.target.value))
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D1D5DB] bg-[#F8FAF8] disabled:text-[#4B5563] disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => handleInputChange("specialization", e.target.value)}
                placeholder="E.g., Crop Specialist"
                disabled={!isEditing}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D1D5DB] bg-[#F8FAF8] disabled:text-[#4B5563] disabled:cursor-not-allowed"
              />
            </div>

            {/* Professional Bio */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Professional Bio
              </label>
              <textarea
                value={formData.professionalBio}
                onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                placeholder="Describe your professional background and expertise"
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D1D5DB] bg-[#F8FAF8] disabled:text-[#4B5563] disabled:cursor-not-allowed resize-none"
              />
              <div className="text-xs text-[#6B7280] mt-1">
                {formData.professionalBio.length}/500 characters
              </div>
            </div>
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
    </div>
  );
}
