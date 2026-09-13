"use client";

import React, { useState } from "react";
import {
  Brain,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Leaf,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  ChevronRight,
} from "lucide-react";

type ReviewStatus = "PENDING" | "AGREED" | "DISAGREED" | "ESCALATED";

interface DiagnosticReview {
  id: string;
  farmerName: string;
  cropName: string;
  cropEmoji: string;
  aiDiagnosis: string;
  aiConfidence: number;
  farmerNote: string;
  submittedAt: string;
  status: ReviewStatus;
  expertComment?: string;
}

const MOCK_REVIEWS: DiagnosticReview[] = [
  {
    id: "1",
    farmerName: "Ram Bahadur Thapa",
    cropName: "Tomato",
    cropEmoji: "🍅",
    aiDiagnosis: "Early Blight (Alternaria solani)",
    aiConfidence: 87,
    farmerNote: "Leaves started yellowing and showing brown spots 3 days ago after heavy rain.",
    submittedAt: "2026-09-12T08:30:00Z",
    status: "PENDING",
  },
  {
    id: "2",
    farmerName: "Sita Devi Sharma",
    cropName: "Potato",
    cropEmoji: "🥔",
    aiDiagnosis: "Late Blight (Phytophthora infestans)",
    aiConfidence: 72,
    farmerNote: "Dark spots on leaves, plant seems to be wilting from the base.",
    submittedAt: "2026-09-11T14:00:00Z",
    status: "AGREED",
    expertComment: "Confirmed. Apply copper-based fungicide immediately and ensure good drainage.",
  },
  {
    id: "3",
    farmerName: "Hari Prasad Koirala",
    cropName: "Rice",
    cropEmoji: "🌾",
    aiDiagnosis: "Bacterial Leaf Blight",
    aiConfidence: 55,
    farmerNote: "Water-soaked streaks along leaf edges turning yellow.",
    submittedAt: "2026-09-10T09:15:00Z",
    status: "DISAGREED",
    expertComment: "This appears to be Sheath Blight, not Bacterial Leaf Blight. Recommend validamycin treatment.",
  },
  {
    id: "4",
    farmerName: "Gita Kumari Poudel",
    cropName: "Maize",
    cropEmoji: "🌽",
    aiDiagnosis: "Fall Armyworm infestation",
    aiConfidence: 91,
    farmerNote: "Holes in leaves, frass visible in whorls of young plants.",
    submittedAt: "2026-09-09T16:45:00Z",
    status: "ESCALATED",
  },
];

const statusConfig: Record<ReviewStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
  PENDING: { label: "Awaiting Review", color: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200", icon: <Clock className="w-3.5 h-3.5" /> },
  AGREED: { label: "AI Confirmed", color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  DISAGREED: { label: "Corrected", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200", icon: <XCircle className="w-3.5 h-3.5" /> },
  ESCALATED: { label: "Escalated", color: "text-rose-700", bgColor: "bg-rose-50", borderColor: "border-rose-200", icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

export default function ExpertAIReviewsPage() {
  const [reviews, setReviews] = useState<DiagnosticReview[]>(MOCK_REVIEWS);
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  const filtered = filterStatus === "ALL" ? reviews : reviews.filter((r) => r.status === filterStatus);

  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

  const handleAction = (id: string, action: "AGREED" | "DISAGREED" | "ESCALATED") => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: action, expertComment: commentDraft[id] || r.expertComment }
          : r
      )
    );
    setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Expert Workspace</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">AI Diagnostic Reviews</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Verify AI crop disease diagnoses submitted by farmers. Your review improves model accuracy.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-amber-100 border border-amber-300 px-3.5 py-2 text-xs font-bold text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} pending review{pendingCount !== 1 ? "s" : ""}
          </div>
        )}
      </header>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["ALL", "PENDING", "AGREED", "DISAGREED"] as const).map((s) => {
          const count = s === "ALL" ? reviews.length : reviews.filter((r) => r.status === s).length;
          const cfg = s === "ALL" ? null : statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-xl border p-3 sm:p-4 text-left transition-all ${
                filterStatus === s
                  ? "ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/60"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className={`text-[11px] font-medium ${cfg ? cfg.color : "text-slate-500"}`}>
                {s === "ALL" ? "All Cases" : cfg?.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {(["ALL", "PENDING", "AGREED", "DISAGREED", "ESCALATED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
              filterStatus === s
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {s === "ALL" ? "All" : statusConfig[s].label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dashed border-slate-200 bg-white">
            <Brain className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No reviews in this category</p>
          </div>
        ) : (
          filtered.map((review) => {
            const cfg = statusConfig[review.status];
            const isExpanded = expandedId === review.id;

            return (
              <div
                key={review.id}
                className={`rounded-xl border ${cfg.borderColor} bg-white shadow-xs overflow-hidden`}
              >
                {/* Card Header */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg shrink-0">
                        {review.cropEmoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{review.farmerName}</span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bgColor} ${cfg.borderColor} ${cfg.color}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <Leaf className="w-3 h-3 inline mr-1 text-emerald-600" />
                          {review.cropName} · {new Date(review.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : review.id)}
                      className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isExpanded ? "Collapse" : "Review"}
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                  </div>

                  {/* AI Diagnosis Badge */}
                  <div className="mt-3 flex flex-col xs:flex-row xs:items-center gap-2">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 flex-1 min-w-0">
                      <Brain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">AI Diagnosis</p>
                        <p className="text-xs font-semibold text-slate-900 truncate">{review.aiDiagnosis}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="text-[10px] font-bold text-slate-500">Confidence</div>
                      <div className={`text-sm font-black ${review.aiConfidence >= 80 ? "text-emerald-700" : review.aiConfidence >= 60 ? "text-amber-700" : "text-red-600"}`}>
                        {review.aiConfidence}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                    {/* Farmer Note */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Farmer's Observation</h4>
                      <p className="text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-3 leading-relaxed">
                        {review.farmerNote}
                      </p>
                    </div>

                    {/* Expert Comment */}
                    {review.status === "PENDING" ? (
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Expert Comment (optional)</h4>
                        <textarea
                          value={commentDraft[review.id] || ""}
                          onChange={(e) => setCommentDraft((prev) => ({ ...prev, [review.id]: e.target.value }))}
                          rows={3}
                          placeholder="Add your assessment, corrections, or recommendations for the farmer…"
                          className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 p-3 bg-white text-slate-900 placeholder-slate-400 resize-none focus:outline-emerald-600"
                        />
                      </div>
                    ) : review.expertComment ? (
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Expert Comment</h4>
                        <div className="flex items-start gap-2.5 bg-white border border-slate-200 rounded-lg p-3">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <p className="text-xs sm:text-sm text-slate-700">{review.expertComment}</p>
                        </div>
                      </div>
                    ) : null}

                    {/* Action Buttons */}
                    {review.status === "PENDING" && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1">
                        <button
                          onClick={() => handleAction(review.id, "AGREED")}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 transition-colors shadow-xs min-h-[42px]"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          Confirm AI Diagnosis
                        </button>
                        <button
                          onClick={() => handleAction(review.id, "DISAGREED")}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 transition-colors shadow-xs min-h-[42px]"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          Provide Correction
                        </button>
                        <button
                          onClick={() => handleAction(review.id, "ESCALATED")}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 transition-colors min-h-[42px] sm:w-auto w-full"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Escalate
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
