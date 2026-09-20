"use client";
import React from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto">
        <div className="flex items-center justify-between p-4 sm:p-5 pb-3 border-b border-[#EEF0EE] shrink-0">
          <h3 className="text-base font-bold text-[#1F2937] tracking-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F1F5F2] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}
