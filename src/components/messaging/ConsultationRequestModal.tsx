"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Loader2, Send, Tag, Clock } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { consultationService } from '@/services/messaging';
import { packageService } from '@/services/packageService';
import { toast } from '@/lib/toast-utils';
import type { ConsultationDetailDto } from '@/types/messaging';
import type { ConsultationPackage } from '@/types/payment';

interface ConsultationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: number;
  expertName?: string;
  onSuccess?: (consultation: ConsultationDetailDto) => void;
}

export function ConsultationRequestModal({
  isOpen,
  onClose,
  expertId,
  expertName,
  onSuccess,
}: ConsultationRequestModalProps) {
  const router = useRouter();
  const [packages, setPackages] = useState<ConsultationPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && expertId) {
      setLoadingPackages(true);
      packageService
        .listExpertPackages(expertId)
        .then((pkgs) => {
          setPackages(pkgs);
          if (pkgs.length > 0) {
            setSelectedPackageId(pkgs[0].id);
          }
        })
        .catch(() => {
          // graceful fallback
        })
        .finally(() => {
          setLoadingPackages(false);
        });
    }
  }, [isOpen, expertId]);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !expertId) return;

    try {
      setIsSubmitting(true);
      const consultation = await consultationService.requestConsultation({
        expertId,
        packageId: selectedPackageId || undefined,
        cropId: selectedPkg?.cropId || undefined,
        subject: subject.trim(),
        description: description.trim() || undefined,
      });

      toast.success('Consultation requested!', {
        description: `Your request was sent to ${expertName || 'the expert'}.`,
      });

      onClose();
      if (onSuccess) {
        onSuccess(consultation);
      } else {
        router.push(`/farmer/consultations/${consultation.id}`);
      }
    } catch (err: any) {
      toast.error('Failed to request consultation', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Consultation ${expertName ? `with ${expertName}` : ''}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Advisory Package Selector (if expert has defined packages) */}
        {packages.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Select Advisory Package <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <select
                value={selectedPackageId || ""}
                onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-[#1F2937] bg-white font-medium"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — NPR {Number(pkg.price).toLocaleString()} ({pkg.durationHours}h window)
                  </option>
                ))}
              </select>

              {selectedPkg && (
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#15803D]">
                    <span>Fee: NPR {Number(selectedPkg.price).toLocaleString()}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPkg.durationHours} Hours Session
                    </span>
                  </div>
                  {selectedPkg.description && (
                    <p className="text-[#166534] text-[11px] leading-relaxed">
                      {selectedPkg.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Problem Subject / Topic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Yellowing leaf spots on potato plants"
            required
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-[#1F2937]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Detailed Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the symptoms, affected area, age of crop, or recent weather conditions..."
            rows={4}
            className="w-full p-3 text-sm rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent resize-none text-[#1F2937]"
          />
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#2E7D32]">
          <Sprout className="w-4 h-4 shrink-0 text-[#2E7D32]" />
          <span>
            Once the expert accepts, you can chat live and upload field photos directly.
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#EEF0EE]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !subject.trim()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Requesting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
