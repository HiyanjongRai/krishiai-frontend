"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Clock,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { consultationService } from "@/services/messaging";
import { paymentService } from "@/services/paymentService";
import { useToast } from "@/providers/toast-provider";
import type { ConsultationDetailDto } from "@/types/messaging";
import type { PaymentInitiationResponse } from "@/types/payment";

export default function FarmerPaymentCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = Number(params?.consultationId);
  const { toast } = useToast();

  const [consultation, setConsultation] = useState<ConsultationDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitiating, setIsInitiating] = useState(false);

  // Hidden form container for eSewa auto-post
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!consultationId) return;

    consultationService
      .getConsultation(consultationId)
      .then((data) => {
        setConsultation(data);
        if (data.status === "ACTIVE") {
          toast.info({ title: "Consultation is already paid and active!" });
          router.push(`/farmer/consultations/${consultationId}`);
        }
      })
      .catch((err) => {
        toast.error({ title: "Unable to load consultation", description: err.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [consultationId, router, toast]);

  const handlePayWithEsewa = async () => {
    if (!consultation) return;

    try {
      setIsInitiating(true);
      const origin = window.location.origin;
      const successUrl = `${origin}/payment/callback`;
      const failureUrl = `${origin}/payment/callback?failure=true&consultationId=${consultationId}`;

      const initResponse: PaymentInitiationResponse = await paymentService.initiatePayment(
        consultation.id,
        successUrl,
        failureUrl
      );

      // Create a form element dynamically and submit to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = initResponse.paymentUrl;

      // Populate signed fields from backend
      Object.entries(initResponse.formFields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      toast.error({
        title: "Payment initiation failed",
        description: err.message || "Could not connect to eSewa payment gateway.",
      });
      setIsInitiating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
        <p className="text-xs text-[#6B7280]">Loading payment invoice...</p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center max-w-md mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-[#1F2937]">Consultation Not Found</h2>
        <Link
          href="/farmer/consultations"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Inquiries
        </Link>
      </div>
    );
  }

  const fee = consultation.priceAtPurchase ?? 0;
  const durationHours = consultation.durationHours ?? 24;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Top back button */}
      <div className="flex items-center gap-2">
        <Link
          href={`/farmer/consultations/${consultation.id}`}
          className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#1F2937]">Complete Consultation Payment</h1>
          <p className="text-xs text-[#6B7280]">
            Secure checkout via eSewa Digital Wallet
          </p>
        </div>
      </div>

      {/* Main Checkout Card */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Expert & Service Details */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Expert Advisory
            </span>
            <h2 className="text-lg font-bold text-[#1F2937]">
              {consultation.expert?.fullName ?? "Agricultural Specialist"}
            </h2>
            <p className="text-xs text-[#6B7280]">
              {consultation.subject || `Consultation #${consultation.id}`}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#6B7280]">Consultation Fee</div>
            <div className="text-2xl font-black text-[#1F2937]">
              NPR {Number(fee).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="space-y-3 text-xs text-[#4B5563]">
          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="flex items-center gap-1.5 text-[#374151] font-medium">
              <Sprout className="w-4 h-4 text-[#2E7D32]" />
              Crop / Topic
            </span>
            <span className="font-semibold text-[#1F2937]">
              {consultation.cropName ?? "General Agriculture"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="flex items-center gap-1.5 text-[#374151] font-medium">
              <Clock className="w-4 h-4 text-[#2E7D32]" />
              Consultation Window
            </span>
            <span className="font-semibold text-[#1F2937]">
              {durationHours} Hours Active Messaging
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-[#374151] font-medium">Subtotal</span>
            <span>NPR {Number(fee).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-[#374151] font-medium">Processing Fee</span>
            <span className="text-[#059669] font-medium">NPR 0 (Included)</span>
          </div>

          <div className="flex items-center justify-between pt-2 text-sm font-bold text-[#1F2937]">
            <span>Total Payable Amount</span>
            <span className="text-lg text-[#2E7D32]">NPR {Number(fee).toLocaleString()}</span>
          </div>
        </div>

        {/* Security & Guarantee Box */}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
          <div className="text-xs text-[#166534] leading-relaxed">
            <p className="font-bold mb-0.5">KrishiAI Buyer Protection Guarantee</p>
            Payment is held securely in escrow until verified by KrishiAI. Once paid, the live chat with your specialist unlocks immediately for direct messaging and photo prescriptions.
          </div>
        </div>

        {/* eSewa Pay Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handlePayWithEsewa}
            disabled={isInitiating}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#60BB46] hover:bg-[#52A33B] text-white font-black text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isInitiating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connecting to eSewa Gateway...</span>
              </>
            ) : (
              <>
                <span className="bg-white text-[#60BB46] px-2 py-0.5 rounded-lg text-xs font-black uppercase">
                  eSewa
                </span>
                <span>Pay NPR {Number(fee).toLocaleString()} with eSewa</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-[#9CA3AF]">
            You will be redirected to eSewa ePay portal to complete payment safely.
          </p>
        </div>
      </div>

      <div ref={formContainerRef} className="hidden" />
    </div>
  );
}
