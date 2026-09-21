"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { paymentService } from "@/services/paymentService";
import type { PaymentResponseDto } from "@/types/payment";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dataParam = searchParams.get("data");
  const failureParam = searchParams.get("failure");
  const consultationIdParam = searchParams.get("consultationId");

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentResponseDto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isVerifyingRef = React.useRef(false);

  useEffect(() => {
    if (failureParam === "true") {
      setErrorMessage("Payment was cancelled or could not be completed with eSewa.");
      setLoading(false);
      return;
    }

    if (!dataParam) {
      setErrorMessage("Invalid payment callback: No verification data was received.");
      setLoading(false);
      return;
    }

    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    // Call backend to verify HMAC signature & eSewa status
    paymentService
      .verifyPayment({ data: dataParam })
      .then((res) => {
        setPayment(res);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage(
          err.message || "Payment verification failed. Please contact KrishiAI support if your wallet was debited."
        );
        setLoading(false);
      });
  }, [dataParam, failureParam]);

  if (loading) {
    return (
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-10 max-w-md w-full text-center shadow-md space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#2E7D32] mx-auto" />
        <h2 className="text-lg font-bold text-[#1F2937]">Verifying eSewa Payment</h2>
        <p className="text-xs text-[#6B7280]">
          Cryptographically confirming transaction with eSewa and unlocking your expert consultation...
        </p>
      </div>
    );
  }

  if (errorMessage || !payment) {
    return (
      <div className="bg-white rounded-[24px] border border-red-100 p-8 sm:p-10 max-w-md w-full text-center shadow-md space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#1F2937]">Payment Unsuccessful</h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            {errorMessage ?? "Unable to complete transaction verification."}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {consultationIdParam ? (
            <Link
              href={`/farmer/payments/${consultationIdParam}`}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors"
            >
              Retry Payment
            </Link>
          ) : (
            <Link
              href="/farmer/consultations"
              className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors"
            >
              Go to Consultations
            </Link>
          )}

          <Link
            href="/farmer/dashboard"
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#6B7280] hover:bg-gray-100 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-8 sm:p-10 max-w-lg w-full text-center shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
          <Sparkles className="w-3 h-3" />
          Verified Transaction
        </span>
        <h2 className="text-2xl font-black text-[#1F2937]">Payment Confirmed!</h2>
        <p className="text-xs text-[#6B7280]">
          Your payment has been recorded in the platform ledger. Your consultation session is now active and live messaging is unlocked!
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100 text-xs space-y-2 text-left">
        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-[#6B7280]">Amount Paid:</span>
          <span className="font-bold text-[#1F2937]">NPR {Number(payment.amount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-[#6B7280]">Payment Method:</span>
          <span className="font-semibold text-[#60BB46]">eSewa Digital Wallet</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-gray-100">
          <span className="text-[#6B7280]">Transaction ID:</span>
          <span className="font-mono text-[#374151] truncate max-w-[200px]">
            {payment.providerTransactionId || payment.transactionUuid}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[#6B7280]">Status:</span>
          <span className="font-bold text-[#2E7D32]">ACTIVE &amp; VERIFIED</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-2 pt-2">
        <Link
          href={`/farmer/consultations/${payment.consultationId}`}
          className="w-full py-3 px-6 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Open Live Consultation Chat</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/farmer/consultations"
          className="block text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] py-1 transition-colors"
        >
          View All Inquiries
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAF8]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
            <p className="text-xs text-[#6B7280]">Processing payment redirect...</p>
          </div>
        }
      >
        <PaymentCallbackContent />
      </Suspense>
    </div>
  );
}
