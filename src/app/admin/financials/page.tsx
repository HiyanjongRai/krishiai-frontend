"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Coins,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Users,
  Building,
  ArrowUpRight,
  Filter,
  AlertCircle,
  Play,
  Check,
  X,
  FileText,
  Send,
  RefreshCw,
  Copy,
} from "lucide-react";
import { adminFinancialService } from "@/services/adminFinancialService";
import { useToast } from "@/providers/toast-provider";
import { Modal } from "@/components/ui/modal";
import type {
  AdminFinancialSummary,
  PaymentResponseDto,
  WithdrawalRequest,
  WithdrawalStatus,
} from "@/types/payment";

type StatusTab = "ALL" | "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "REJECTED" | "CANCELLED";

export default function AdminFinancialsPage() {
  const { toast } = useToast();
  const [summary, setSummary] = useState<AdminFinancialSummary | null>(null);
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatusTab, setSelectedStatusTab] = useState<StatusTab>("ALL");

  // Modal states
  const [activeModal, setActiveModal] = useState<"APPROVE" | "PROCESS" | "REJECT" | "COMPLETE" | "FAIL" | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [modalPayoutRef, setModalPayoutRef] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      const [sumRes, payRes, withRes] = await Promise.all([
        adminFinancialService.getFinancialSummary(),
        adminFinancialService.listAllPayments(0, 50),
        adminFinancialService.listAllWithdrawals(),
      ]);
      setSummary(sumRes);
      setPayments(payRes);
      setWithdrawals(withRes);
    } catch (err: any) {
      toast.error({ title: "Failed to load financial records", description: err.message });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered withdrawals
  const filteredWithdrawals = useMemo(() => {
    if (selectedStatusTab === "ALL") return withdrawals;
    return withdrawals.filter((w) => w.status === selectedStatusTab);
  }, [withdrawals, selectedStatusTab]);

  // Counts for tabs
  const counts = useMemo(() => {
    const map: Record<string, number> = {
      ALL: withdrawals.length,
      PENDING: 0,
      APPROVED: 0,
      PROCESSING: 0,
      COMPLETED: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };
    withdrawals.forEach((w) => {
      if (map[w.status] !== undefined) {
        map[w.status]++;
      }
    });
    return map;
  }, [withdrawals]);

  // Open modals
  const openApproveModal = (w: WithdrawalRequest) => {
    setSelectedWithdrawal(w);
    setActiveModal("APPROVE");
  };

  const openProcessModal = (w: WithdrawalRequest) => {
    setSelectedWithdrawal(w);
    setActiveModal("PROCESS");
  };

  const openRejectModal = (w: WithdrawalRequest) => {
    setSelectedWithdrawal(w);
    setModalNotes("");
    setActiveModal("REJECT");
  };

  const openCompleteModal = (w: WithdrawalRequest) => {
    setSelectedWithdrawal(w);
    setModalPayoutRef("");
    setModalNotes("");
    setActiveModal("COMPLETE");
  };

  const openFailModal = (w: WithdrawalRequest) => {
    setSelectedWithdrawal(w);
    setModalNotes("");
    setActiveModal("FAIL");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedWithdrawal(null);
    setModalNotes("");
    setModalPayoutRef("");
  };

  // Modal Submit Handlers
  const handleApproveConfirm = async () => {
    if (!selectedWithdrawal) return;
    const refText = selectedWithdrawal.referenceNumber ?? `#${selectedWithdrawal.id}`;
    try {
      setIsSubmittingAction(true);
      await adminFinancialService.approveWithdrawal(selectedWithdrawal.id);
      toast.success(`Withdrawal ${refText} approved. Ready for processing.`);
      closeModal();
      await loadData(true);
    } catch (err: any) {
      toast.error({ title: "Failed to approve withdrawal", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleProcessConfirm = async () => {
    if (!selectedWithdrawal) return;
    const refText = selectedWithdrawal.referenceNumber ?? `#${selectedWithdrawal.id}`;
    try {
      setIsSubmittingAction(true);
      await adminFinancialService.markWithdrawalProcessing(selectedWithdrawal.id);
      toast.success(`Withdrawal ${refText} moved to PROCESSING.`);
      closeModal();
      await loadData(true);
    } catch (err: any) {
      toast.error({ title: "Failed to start processing", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Modal Submit Handlers
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;
    const refText = selectedWithdrawal.referenceNumber ?? `#${selectedWithdrawal.id}`;
    try {
      setIsSubmittingAction(true);
      await adminFinancialService.rejectWithdrawal(selectedWithdrawal.id, modalNotes.trim() || undefined);
      toast.success(`Withdrawal ${refText} rejected.`);
      closeModal();
      await loadData(true);
    } catch (err: any) {
      toast.error({ title: "Failed to reject withdrawal", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;
    const refText = selectedWithdrawal.referenceNumber ?? `#${selectedWithdrawal.id}`;
    if (!modalPayoutRef.trim()) {
      toast.error("Please enter a valid payout transaction or reference ID.");
      return;
    }
    try {
      setIsSubmittingAction(true);
      await adminFinancialService.markWithdrawalCompleted(
        selectedWithdrawal.id,
        modalPayoutRef.trim(),
        modalNotes.trim() || undefined
      );
      toast.success(`Withdrawal ${refText} marked COMPLETED. Earnings ledger debited.`);
      closeModal();
      await loadData(true);
    } catch (err: any) {
      toast.error({ title: "Failed to complete withdrawal", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleFailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal) return;
    const refText = selectedWithdrawal.referenceNumber ?? `#${selectedWithdrawal.id}`;
    try {
      setIsSubmittingAction(true);
      await adminFinancialService.markWithdrawalFailed(selectedWithdrawal.id, modalNotes.trim() || undefined);
      toast.info(`Withdrawal ${refText} marked FAILED. Funds released back to expert balance.`);
      closeModal();
      await loadData(true);
    } catch (err: any) {
      toast.error({ title: "Failed to update withdrawal", description: err.message });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Coins className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-[#1F2937]">Platform Financials &amp; Payouts</h1>
          </div>
          <p className="text-sm text-[#6B7280]">
            Global revenue oversight, 5% platform commission audit, and expert payout lifecycle management.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={isRefreshing || isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Transaction Volume</span>
            <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="text-2xl font-black text-[#1F2937]">
            NPR {(summary?.totalGrossRevenue ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">
            {summary?.successfulPaymentsCount ?? 0} successful consultations
          </div>
        </div>

        {/* Platform 5% Commission */}
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 text-white shadow-xs">
          <div className="flex items-center justify-between text-white/80 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Commission (5%)</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">
            NPR {(summary?.totalPlatformCommission ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-white/80 mt-1">Net platform infrastructure revenue</div>
        </div>

        {/* Expert Payouts Total */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expert Payouts (95%)</span>
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-black text-[#1F2937]">
            NPR {(summary?.totalExpertEarnings ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#4B5563] font-medium mt-1">
            Authoritatively managed via financial ledger
          </div>
        </div>
      </div>

      {/* Expert Withdrawals Management Section */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <span>Expert Payout Management</span>
              {counts.PENDING > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  {counts.PENDING} Action Required
                </span>
              )}
            </h2>
            <p className="text-xs text-[#6B7280]">
              Review, approve, disburse, and finalize expert withdrawal requests.
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-gray-100">
          {(
            [
              { id: "ALL", label: "All Requests" },
              { id: "PENDING", label: "Pending" },
              { id: "APPROVED", label: "Approved" },
              { id: "PROCESSING", label: "Processing" },
              { id: "COMPLETED", label: "Completed" },
              { id: "REJECTED", label: "Rejected" },
              { id: "CANCELLED", label: "Failed / Cancelled" },
            ] as const
          ).map((tab) => {
            const isSelected = selectedStatusTab === tab.id;
            const count = counts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#2E7D32] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Withdrawals Table */}
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[#6B7280] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2E7D32]" />
            <span>Loading payout requests...</span>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7280] bg-gray-50 rounded-2xl border border-gray-100">
            No withdrawal requests match the selected status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[#9CA3AF] font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Req ID / Date</th>
                  <th className="pb-3 px-3">Agronomist</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Account Details</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Reference / Notes</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Reference & Date */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-gray-900 text-xs">{req.referenceNumber ?? `#${req.id}`}</div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(req.requestedAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Agronomist */}
                    <td className="py-3.5 px-3 font-semibold text-[#1F2937] whitespace-nowrap">
                      <div>{req.expertName}</div>
                      <div className="text-[10px] font-mono text-gray-400">ID: {req.expertId}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3 font-bold text-[#2E7D32] whitespace-nowrap text-sm">
                      NPR {Number(req.amount).toLocaleString()}
                    </td>

                    {/* Account Details */}
                    <td className="py-3.5 px-3 text-[#4B5563] max-w-xs break-words">
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/60 font-mono text-[11px] select-all">
                        {req.accountDetails}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {req.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {req.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <Check className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {req.status === "PROCESSING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Loader2 className="w-3 h-3 animate-spin" /> Processing
                        </span>
                      )}
                      {req.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {req.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                      {(req.status === "CANCELLED" || req.status === "FAILED") && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <AlertCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>

                    {/* Reference / Notes */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      {req.payoutReference && (
                        <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                          <span>Ref: {req.payoutReference}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(req.payoutReference!)}
                            className="hover:text-emerald-950 cursor-pointer"
                            title="Copy reference"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {req.adminNotes && (
                        <p className="text-[11px] text-gray-600 truncate mt-0.5" title={req.adminNotes}>
                          {req.adminNotes}
                        </p>
                      )}
                      {req.processedAt && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          At: {new Date(req.processedAt).toLocaleDateString()}
                        </p>
                      )}
                      {!req.payoutReference && !req.adminNotes && !req.processedAt && (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* PENDING State Actions */}
                        {req.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => openApproveModal(req)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openRejectModal(req)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[11px] transition-all cursor-pointer disabled:opacity-50"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {/* APPROVED State Actions */}
                        {req.status === "APPROVED" && (
                          <>
                            <button
                              type="button"
                              onClick={() => openProcessModal(req)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Process</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openRejectModal(req)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[11px] transition-all cursor-pointer disabled:opacity-50"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {/* PROCESSING State Actions */}
                        {req.status === "PROCESSING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => openCompleteModal(req)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mark Disbursed</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openFailModal(req)}
                              disabled={isSubmittingAction}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 font-bold text-[11px] transition-all cursor-pointer disabled:opacity-50"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>Mark Failed</span>
                            </button>
                          </>
                        )}

                        {/* Final States */}
                        {["COMPLETED", "REJECTED", "CANCELLED", "FAILED"].includes(req.status) && (
                          <span className="text-[11px] text-gray-400 italic">No pending action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Transactions Audit Log */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">Consultation Payment Ledger Audit</h2>
            <p className="text-xs text-[#6B7280]">
              Complete immutable record of all consultation payments processed via eSewa checkout.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-[#6B7280] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2E7D32]" />
            <span>Loading payment records...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7280] bg-gray-50 rounded-xl">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[#9CA3AF] font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Consultation</th>
                  <th className="pb-3 px-3">Provider</th>
                  <th className="pb-3 px-3">Transaction UUID</th>
                  <th className="pb-3 px-3 text-right">Gross Amount</th>
                  <th className="pb-3 px-3 text-right">Platform (5%)</th>
                  <th className="pb-3 px-3 text-right">Expert (95%)</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 text-[#4B5563] whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#1F2937] font-mono text-xs">
                        {p.consultationReferenceNumber ?? `#${p.consultationId}`}
                      </div>
                      {p.referenceNumber && (
                        <div className="text-[10px] font-mono text-gray-400">
                          {p.referenceNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#E8F5E9] text-[#2E7D32]">
                        {p.provider}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#6B7280] text-[11px] max-w-[150px] truncate">
                      {p.transactionUuid}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#1F2937]">
                      NPR {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-[#059669] font-semibold">
                      NPR {Number(p.platformCommission).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-[#2563EB] font-semibold">
                      NPR {Number(p.expertAmount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "SUCCESS"
                            ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
                            : p.status === "PENDING"
                            ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                            : "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Approve Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={activeModal === "APPROVE"} onClose={closeModal} title="Approve Withdrawal Request">
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#1B5E20]">
                Withdrawal {selectedWithdrawal?.referenceNumber ?? `#${selectedWithdrawal?.id}`}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
                Pending Review
              </span>
            </div>
            <div className="pt-1 text-xs space-y-1">
              <p>
                Agronomist: <strong className="text-gray-900">{selectedWithdrawal?.expertName}</strong>
              </p>
              <p>
                Payout Amount: <strong className="font-mono text-sm text-[#2E7D32]">NPR {selectedWithdrawal?.amount.toLocaleString()}</strong>
              </p>
              <div className="font-mono text-[11px] bg-white/80 p-2 rounded-lg mt-1 border border-emerald-200/80">
                <span className="text-gray-500 block text-[10px] font-sans font-medium">Destination Account:</span>
                {selectedWithdrawal?.accountDetails}
              </div>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Approving validates this withdrawal request and moves it to <strong className="text-indigo-700">APPROVED</strong> status, authorizing the disbursement process.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmittingAction}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApproveConfirm}
              disabled={isSubmittingAction}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm Approval</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Process Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={activeModal === "PROCESS"} onClose={closeModal} title="Initiate Payout Processing">
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-900">
                Withdrawal {selectedWithdrawal?.referenceNumber ?? `#${selectedWithdrawal?.id}`}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                Approved
              </span>
            </div>
            <div className="pt-1 text-xs space-y-1">
              <p>
                Agronomist: <strong className="text-gray-900">{selectedWithdrawal?.expertName}</strong>
              </p>
              <p>
                Payout Amount: <strong className="font-mono text-sm text-blue-700">NPR {selectedWithdrawal?.amount.toLocaleString()}</strong>
              </p>
              <div className="font-mono text-[11px] bg-white/80 p-2 rounded-lg mt-1 border border-blue-200">
                <span className="text-gray-500 block text-[10px] font-sans font-medium">Destination Account:</span>
                {selectedWithdrawal?.accountDetails}
              </div>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Move this payout request to <strong className="text-blue-700">PROCESSING</strong> status to indicate that transfer via eSewa or bank transfer has been initiated.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmittingAction}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProcessConfirm}
              disabled={isSubmittingAction}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Start Processing</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Reject Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={activeModal === "REJECT"} onClose={closeModal} title="Reject Withdrawal Request">
        <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
            <p className="font-bold">Withdrawal {selectedWithdrawal?.referenceNumber ?? `#${selectedWithdrawal?.id}`}</p>
            <p>
              Amount: <strong className="font-mono">NPR {selectedWithdrawal?.amount.toLocaleString()}</strong> for{" "}
              {selectedWithdrawal?.expertName}
            </p>
            <p className="text-[11px] opacity-80">
              Rejecting will keep the funds in the agronomist&apos;s available earnings balance.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Reason / Admin Notes <span className="text-gray-400 font-normal">(Visible to agronomist)</span>
            </label>
            <textarea
              required
              rows={3}
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              placeholder="E.g., Incomplete bank account number, invalid eSewa ID, or account mismatch..."
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmittingAction}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingAction || !modalNotes.trim()}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Mark Completed Modal ─────────────────────────────────────────── */}
      <Modal isOpen={activeModal === "COMPLETE"} onClose={closeModal} title="Confirm Disbursed Payout">
        <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
            <p className="font-bold">Disbursing Withdrawal {selectedWithdrawal?.referenceNumber ?? `#${selectedWithdrawal?.id}`}</p>
            <p>
              Amount: <strong className="font-mono">NPR {selectedWithdrawal?.amount.toLocaleString()}</strong>
            </p>
            <p>Recipient: {selectedWithdrawal?.expertName}</p>
            <p className="text-[11px] font-mono bg-white/70 p-1.5 rounded mt-1 border border-emerald-200">
              Account: {selectedWithdrawal?.accountDetails}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              eSewa / Bank Transaction Reference ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={modalPayoutRef}
              onChange={(e) => setModalPayoutRef(e.target.value)}
              placeholder="E.g., 000ESW98765432 or TRF-2026-0912"
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              This reference will be permanently recorded in the immutable wallet ledger.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Optional Admin Notes
            </label>
            <input
              type="text"
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              placeholder="E.g., Disbursed via eSewa merchant portal"
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmittingAction}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingAction || !modalPayoutRef.trim()}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Mark as Completed</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Mark Failed Modal ────────────────────────────────────────────── */}
      <Modal isOpen={activeModal === "FAIL"} onClose={closeModal} title="Mark Payout as Failed">
        <form onSubmit={handleFailSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
            <p className="font-bold">Withdrawal {selectedWithdrawal?.referenceNumber ?? `#${selectedWithdrawal?.id}`} Failure</p>
            <p>
              Amount: <strong className="font-mono">NPR {selectedWithdrawal?.amount.toLocaleString()}</strong>
            </p>
            <p className="text-[11px]">
              Marking this as failed will cancel the request and release the held funds back into the expert&apos;s available earnings balance.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Failure Reason / Error Details <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              placeholder="E.g., eSewa API transfer failed: Wallet limit reached or account suspended..."
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmittingAction}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingAction}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm Failure</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
