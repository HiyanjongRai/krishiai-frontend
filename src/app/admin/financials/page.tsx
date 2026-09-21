"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { adminFinancialService } from "@/services/adminFinancialService";
import { useToast } from "@/providers/toast-provider";
import type {
  AdminFinancialSummary,
  PaymentResponseDto,
  WithdrawalRequest,
} from "@/types/payment";

export default function AdminFinancialsPage() {
  const { toast } = useToast();
  const [summary, setSummary] = useState<AdminFinancialSummary | null>(null);
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [sumRes, payRes, withRes] = await Promise.all([
          adminFinancialService.getFinancialSummary(),
          adminFinancialService.listAllPayments(0, 50),
          adminFinancialService.getPendingWithdrawals(),
        ]);
        setSummary(sumRes);
        setPayments(payRes);
        setPendingWithdrawals(withRes);
      } catch (err: any) {
        toast.error({ title: "Failed to load financial records", description: err.message });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [toast]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Coins className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-[#1F2937]">Platform Financials</h1>
          </div>
          <p className="text-sm text-[#6B7280]">
            Global revenue oversight, 5% platform commission audit, and expert payout management.
          </p>
        </div>
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
            Directly credited to verified agronomists
          </div>
        </div>
      </div>

      {/* Pending Withdrawals Section */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">Pending Expert Payout Requests</h2>
            <p className="text-xs text-[#6B7280]">
              Agronomist withdrawal requests awaiting disbursement via eSewa or bank transfer.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            {pendingWithdrawals.length} Pending
          </span>
        </div>

        {pendingWithdrawals.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#6B7280] bg-gray-50 rounded-xl border border-gray-100">
            No pending withdrawal requests at this time. All payouts are up to date!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[#9CA3AF] font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Requested At</th>
                  <th className="pb-3 px-3">Expert</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Account Details</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 text-[#4B5563] whitespace-nowrap">
                      {new Date(req.requestedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1F2937]">{req.expertName}</td>
                    <td className="py-3 px-3 font-bold text-[#2E7D32]">
                      NPR {Number(req.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-[#4B5563] max-w-sm break-words">
                      {req.accountDetails}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
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
            <h2 className="text-base font-bold text-[#1F2937]">Transaction Ledger Audit</h2>
            <p className="text-xs text-[#6B7280]">
              Complete immutable record of all consultation payments processed via eSewa.
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
                    <td className="py-3 px-3 font-semibold text-[#1F2937]">
                      #{p.consultationId}
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
    </div>
  );
}
