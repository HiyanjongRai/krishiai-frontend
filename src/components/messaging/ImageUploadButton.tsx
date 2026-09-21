"use client";

import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, X, Send } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/lib/toast-utils';

interface ImageUploadButtonProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export function ImageUploadButton({ onUpload, disabled }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please select an image file (PNG, JPG, or WEBP).',
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error('File too large', {
        description: `Image must be less than ${MAX_SIZE_MB}MB.`,
      });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Reset input value so same file can be selected again if cancelled
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFile);
      handleClose();
    } catch (err: any) {
      toast.error('Upload failed', { description: err.message });
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="p-2.5 rounded-xl text-[#6B7280] hover:text-[#2E7D32] hover:bg-[#E8F5E9]/50 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
        title="Send crop photo or image"
      >
        <ImagePlus className="w-5 h-5" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Modal
        isOpen={Boolean(selectedFile && previewUrl)}
        onClose={handleClose}
        title="Send Image Attachment"
      >
        <div className="space-y-4">
          {previewUrl && (
            <div className="relative rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center max-h-80 border border-[#E5E7EB]">
              <img
                src={previewUrl}
                alt="Selected preview"
                className="max-h-72 w-auto object-contain rounded-xl"
              />
            </div>
          )}

          <div className="text-xs text-[#6B7280] flex justify-between items-center px-1">
            <span className="font-medium text-[#374151] truncate max-w-[200px]">
              {selectedFile?.name}
            </span>
            <span>
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#EEF0EE]">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={handleConfirmUpload}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Send Photo
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
