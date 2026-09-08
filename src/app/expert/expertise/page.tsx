/**
 * Expert Expertise Management Page
 * Allows experts to view, add, and manage their areas of expertise
 */

"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, AlertCircle, Leaf } from "lucide-react";
import Link from "next/link";
import { ExpertExpertise } from "@/types/expert-verification";

const EXPERTISE_ICONS: Record<string, string> = {
  Tomato: "🍅",
  Potato: "🥔",
  Cauliflower: "🥦",
  Rice: "🌾",
  Maize: "🌽",
  Wheat: "🌾",
  Cucumber: "🥒",
  "Pest Management": "🔬",
  "Disease Management": "🌡️",
  "Soil Management": "🌱",
  Irrigation: "💧",
  "Crop Planning": "📋",
  "Organic Farming": "🍃",
  "Fertilizer Management": "⚗️",
};

const AVAILABLE_CROPS = [
  "Tomato",
  "Potato",
  "Cauliflower",
  "Rice",
  "Maize",
  "Wheat",
  "Cucumber",
  "Carrot",
  "Lettuce",
  "Spinach",
];

const AVAILABLE_SPECIALIZATIONS = [
  "Pest Management",
  "Disease Management",
  "Soil Management",
  "Irrigation",
  "Crop Planning",
  "Organic Farming",
  "Fertilizer Management",
  "Harvesting",
  "Storage",
  "Marketing",
];

export default function ExpertExpertisePage() {
  const [expertise, setExpertise] = useState<ExpertExpertise[]>([
    {
      id: "1",
      name: "Tomato",
      category: "CROP",
      status: "PENDING",
    },
    {
      id: "2",
      name: "Potato",
      category: "CROP",
      status: "PENDING",
    },
    {
      id: "3",
      name: "Pest Management",
      category: "PROFESSIONAL_EXPERTISE",
      status: "PENDING",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"CROP" | "PROFESSIONAL_EXPERTISE">("CROP");
  const [selectedExpertise, setSelectedExpertise] = useState("");

  const getIcon = (name: string): string => {
    return EXPERTISE_ICONS[name] || "🌿";
  };

  const getStatusColor = (status: "PENDING" | "VERIFIED" | "REJECTED") => {
    switch (status) {
      case "VERIFIED":
        return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
      case "REJECTED":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
      case "PENDING":
      default:
        return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    }
  };

  const handleAddExpertise = () => {
    if (!selectedExpertise) return;

    const newExpertise: ExpertExpertise = {
      id: Date.now().toString(),
      name: selectedExpertise,
      category: selectedCategory,
      status: "PENDING",
    };

    setExpertise([...expertise, newExpertise]);
    setSelectedExpertise("");
    setShowAddForm(false);
  };

  const handleRemoveExpertise = (id: string) => {
    setExpertise(expertise.filter((e) => e.id !== id));
  };

  const cropExpertise = expertise.filter((e) => e.category === "CROP");
  const professionalExpertise = expertise.filter((e) => e.category === "PROFESSIONAL_EXPERTISE");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Expertise & Specializations</h1>
          <p className="text-slate-600 mt-1">
            Manage your areas of expertise and professional specializations
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <span className="font-semibold">Note:</span> All expertise areas are verified during the admin review process. Only add areas where you have genuine professional expertise.
        </div>
      </div>

      {/* Primary Crops Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            Primary Crops
          </h2>
          <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {cropExpertise.length}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Select the crops you specialize in. You can add up to 3 primary crops.
        </p>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {cropExpertise.map((exp) => {
            const colors = getStatusColor(exp.status);
            const icon = getIcon(exp.name);

            return (
              <div
                key={exp.id}
                className={`rounded-2xl p-4 border ${colors.bg} ${colors.border} relative`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{icon}</div>
                    <div>
                      <div className="font-semibold text-slate-900">{exp.name}</div>
                      <div className={`text-xs font-semibold mt-2 px-2.5 py-1 rounded-md inline-block ${colors.text}`}>
                        {exp.status === "VERIFIED" ? "✓ Verified" : 
                         exp.status === "REJECTED" ? "✗ Rejected" : 
                         "⏳ Pending Review"}
                      </div>
                    </div>
                  </div>
                  {exp.status !== "VERIFIED" && (
                    <button
                      onClick={() => handleRemoveExpertise(exp.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove expertise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Crop Form */}
        {showAddForm && selectedCategory === "CROP" && (
          <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Add Primary Crop</h3>
            <div className="flex gap-3">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">Select a crop</option>
                {AVAILABLE_CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddExpertise}
                disabled={!selectedExpertise}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedExpertise("");
                }}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && cropExpertise.length < 3 && (
          <button
            onClick={() => {
              setSelectedCategory("CROP");
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-600 font-semibold rounded-lg transition-colors w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Primary Crop
          </button>
        )}
      </div>

      {/* Professional Expertise Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Professional Expertise</h2>
          <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {professionalExpertise.length}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Select your areas of professional expertise. You can add up to 5 specializations.
        </p>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {professionalExpertise.map((exp) => {
            const colors = getStatusColor(exp.status);
            const icon = getIcon(exp.name);

            return (
              <div
                key={exp.id}
                className={`rounded-2xl p-4 border ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{icon}</div>
                    <div>
                      <div className="font-semibold text-slate-900">{exp.name}</div>
                      <div className={`text-xs font-semibold mt-2 px-2.5 py-1 rounded-md inline-block ${colors.text}`}>
                        {exp.status === "VERIFIED" ? "✓ Verified" : 
                         exp.status === "REJECTED" ? "✗ Rejected" : 
                         "⏳ Pending Review"}
                      </div>
                    </div>
                  </div>
                  {exp.status !== "VERIFIED" && (
                    <button
                      onClick={() => handleRemoveExpertise(exp.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove expertise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Specialization Form */}
        {showAddForm && selectedCategory === "PROFESSIONAL_EXPERTISE" && (
          <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Add Professional Expertise</h3>
            <div className="flex gap-3">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">Select specialization</option>
                {AVAILABLE_SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddExpertise}
                disabled={!selectedExpertise}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedExpertise("");
                }}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && professionalExpertise.length < 5 && (
          <button
            onClick={() => {
              setSelectedCategory("PROFESSIONAL_EXPERTISE");
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-600 font-semibold rounded-lg transition-colors w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Professional Expertise
          </button>
        )}
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-6">
        <h3 className="font-semibold text-emerald-950 mb-3">Tips for Expertise Verification</h3>
        <ul className="space-y-2 text-sm text-emerald-900">
          <li className="flex gap-2">
            <span>✓</span>
            <span>Only add expertise areas where you have verified professional experience</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Supporting documents (certificates, experience letters) help verify your claims</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Rejected expertise can be resubmitted after addressing feedback</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
