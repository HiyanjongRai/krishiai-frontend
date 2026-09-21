"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Loader2,
  X,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { earningsService } from "@/services/earningsService";
import { useToast } from "@/providers/toast-provider";
import type {
  ExpertEarningsSummary,
  WithdrawalRequest,
  CreateWithdrawalRequest,
} from "@/types/payment";

export default function ExpertEarningsPage() {
  const { toast } = useToast();
  const [summary, setSummary] = useState<ExpertEarningsSummary | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ledger" | "withdrawals">("ledger");

  // Withdrawal modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [accountDetails, setAccountDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadEarnings = async () => {
    try {
      setIsLoading(true);
      const [earningsData, withdrawalsData] = await Promise.all([
        earningsService.getMyEarnings(),
        earningsService.listWithdrawals(),
      ]);
      setSummary(earningsData);
      setWithdrawals(withdrawalsData);
    } catch (err: any) {
      toast.error({ title: "Failed to load financial records", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary || withdrawAmount > summary.availableEarnings) {
      toast.error({ title: "Amount exceeds available balance" });
      return;
    }
    if (withdrawAmount < 100) {
      toast.error({ title: "Minimum withdrawal amount is NPR 100" });
      return;
    }
    if (!accountDetails.trim()) {
      toast.error({ title: "Please provide payment destination details" });
      return;
    }

    try {
      setSubmitting(true);
      const req: CreateWithdrawalRequest = {
        amount: withdrawAmount,
        accountDetails: accountDetails.trim(),
      };
      const created = await earningsService.requestWithdrawal(req);
      setWithdrawals((prev) => [created, ...prev]);
      toast.success({
        title: "Withdrawal request submitted!",
        description: "KrishiAI finance will process your payout within 24-48 business hours.",
      });
      setIsModalOpen(false);
      setAccountDetails("");
      // Refresh balances
      loadEarnings();
    } catch (err: any) {
      toast.error({ title: "Withdrawal request failed", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const availableBalance = summary?.availableEarnings ?? 0;

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Wallet className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-[#1F2937]">Earnings &amp; Wallet</h1>
          </div>
          <p className="text-sm text-[#6B7280]">
            Review consultation revenues, automated 95/5 splits, and request wallet withdrawals.
          </p>
        </div>

        <button
          onClick={() => {
            setWithdrawAmount(Math.min(availableBalance, 1000) || 100);
            setIsModalOpen(true);
          }}
          disabled={availableBalance < 100}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Request Payout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available for Payout */}
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 text-white shadow-xs">
          <div className="flex items-center justify-between text-white/80 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Balance</span>
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">
            NPR {availableBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-white/80 mt-1">Ready for withdrawal</div>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Earned (95%)</span>
            <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="text-2xl font-black text-[#1F2937]">
            NPR {(summary?.totalEarnings ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">Lifetime consultation earnings</div>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Payouts</span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-black text-[#1F2937]">
            NPR {(summary?.pendingWithdrawal ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#D97706] font-medium mt-1">Under admin processing</div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Disbursed</span>
            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-black text-[#1F2937]">
            NPR {(summary?.totalWithdrawn ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#6B7280] font-medium mt-1">Completed bank/eSewa payouts</div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-[#F8FAF8] border border-[#E5E7EB] rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
        <div className="text-xs text-[#4B5563] leading-relaxed">
          <span className="font-bold text-[#1F2937]">Append-Only Financial Ledger:</span> Every consultation payment triggers an atomic ledger entry crediting 95% of the fee to your wallet. You can request payouts to your eSewa ID or local Nepali bank account anytime your available balance exceeds NPR 100.
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] overflow-hidden shadow-xs">
        <div className="flex items-center gap-2 p-2 border-b border-gray-100 bg-[#F9FAFB]">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ledger"
                ? "bg-white text-[#2E7D32] shadow-xs"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            Wallet Ledger Transactions ({summary?.transactions?.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "withdrawals"
                ? "bg-white text-[#2E7D32] shadow-xs"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            Payout History ({withdrawals.length})
          </button>
        </div>

        {/* Tab 1: Ledger Table */}
        {activeTab === "ledger" && (
          <div className="p-4">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-[#6B7280] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2E7D32]" />
                <span>Loading ledger transactions...</span>
              </div>
            ) : !summary?.transactions || summary.transactions.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6B7280]">
                No wallet transactions recorded yet. Completed consultations will automatically appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[#9CA3AF] font-bold uppercase tracking-wider">
                      <th className="pb-3 px-3">Date &amp; Time</th>
                      <th className="pb-3 px-3">Type</th>
                      <th className="pb-3 px-3">Description</th>
                      <th className="pb-3 px-3">Ref ID</th>
                      <th className="pb-3 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {summary.transactions.map((entry) => {
                      const isCredit = entry.type === "EXPERT_EARNING";
                      return (
                        <tr key={entry.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-3 text-[#4B5563] whitespace-nowrap">
                            {new Date(entry.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                                isCredit
                                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                                  : "bg-[#FEF3C7] text-[#D97706]"
                              }`}
                            >
                              {isCredit ? (
                                <>
                                  <ArrowDownLeft className="w-3 h-3" />
                                  <span>Earning Credit</span>
                                </>
                              ) : (
                                <>
                                  <ArrowUpRight className="w-3 h-3" />
                                  <span>Withdrawal Debit</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#1F2937] font-medium max-w-xs truncate">
                            {entry.description || "Consultation fee earning"}
                          </td>
                          <td className="py-3 px-3 text-[#6B7280] font-mono">
                            #{entry.referenceId ?? entry.id}
                          </td>
                          <td
                            className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                              isCredit ? "text-[#15803D]" : "text-[#B91C1C]"
                            }`}
                          >
                            {isCredit ? "+" : "-"} NPR {Number(entry.amount).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Withdrawals Table */}
        {activeTab === "withdrawals" && (
          <div className="p-4">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-[#6B7280] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2E7D32]" />
                <span>Loading withdrawal history...</span>
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6B7280]">
                You haven&apos;t submitted any payout requests yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[#9CA3AF] font-bold uppercase tracking-wider">
                      <th className="pb-3 px-3">Requested At</th>
                      <th className="pb-3 px-3">Amount</th>
                      <th className="pb-3 px-3">Destination Details</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3">Admin Notes / Disbursed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {withdrawals.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 text-[#4B5563] whitespace-nowrap">
                          {new Date(req.requestedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#1F2937] whitespace-nowrap">
                          NPR {Number(req.amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-[#4B5563] max-w-sm break-words">
                          {req.accountDetails}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              req.status === "PROCESSED"
                                ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
                                : req.status === "PENDING"
                                ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                                : "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]"
                            }`}
                          >
                            {req.status === "PROCESSED" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Disbursed</span>
                              </>
                            ) : req.status === "PENDING" ? (
                              <>
                                <Clock className="w-3 h-3" />
                                <span>Pending Approval</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                <span>Rejected</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#6B7280]">
                          {req.adminNotes ? (
                            <span className="text-gray-700">{req.adminNotes}</span>
                          ) : req.processedAt ? (
                            <span>Processed on {new Date(req.processedAt).toLocaleDateString()}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
                  <ArrowDownLeft className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-[#1F2937]">Request Payout</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              {/* Available balance indicator */}
              <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#166534]">Available for Payout:</span>
                <span className="text-sm font-black text-[#15803D]">
                  NPR {availableBalance.toLocaleString()}
                </span>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Withdrawal Amount (NPR) *
                </label>
                <input
                  type="number"
                  min={100}
                  max={availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-[#1F2937]"
                  required
                />
                <p className="text-[11px] text-[#6B7280] mt-1">Min: NPR 100, Max: NPR {availableBalance.toLocaleString()}</p>
              </div>

              {/* Account Details */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Payout Destination (eSewa / Nepali Bank) *
                </label>
                <textarea
                  rows={3}
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="e.g.&#10;eSewa ID: 9841234567, Name: Ram Sharma&#10;OR&#10;Nabil Bank, A/C: 0123456789012, Branch: Kathmandu"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] text-[#1F2937]"
                  required
                />
              </div>

              {/* Action Buttons */}
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
                  <span>Confirm Withdrawal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
