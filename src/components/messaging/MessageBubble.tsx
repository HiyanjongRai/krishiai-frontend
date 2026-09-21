"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Check,
  CheckCheck,
  MoreVertical,
  Flag,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import type { MessageResponse } from '@/types/messaging';
import { toast } from '@/lib/toast-utils';

interface MessageBubbleProps {
  message: MessageResponse;
  isCurrentUser: boolean;
  onDelete?: (messageId: number) => Promise<void>;
  onReport?: (messageId: number, reason: string) => Promise<void>;
  showSenderName?: boolean;
}

export function MessageBubble({
  message,
  isCurrentUser,
  onDelete,
  onReport,
  showSenderName = true,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  // Format timestamp (e.g., "10:45 AM")
  const timeStr = React.useMemo(() => {
    try {
      const date = new Date(message.createdAt);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }, [message.createdAt]);

  // System messages rendered as centered pill
  if (message.messageType === 'SYSTEM') {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-medium text-[#2E7D32] shadow-xs text-center max-w-md">
          {message.content}
        </div>
      </div>
    );
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim() || !onReport) return;
    try {
      setIsSubmittingReport(true);
      await onReport(message.id, reportReason.trim());
      toast.success('Report submitted to KrishiAI moderation team.');
      setReportModalOpen(false);
      setReportReason('');
    } catch (err: any) {
      toast.error('Failed to submit report', { description: err.message });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await onDelete(message.id);
        toast.info('Message deleted');
      } catch (err: any) {
        toast.error('Failed to delete message', { description: err.message });
      }
    }
  };

  return (
    <>
      <div
        className={`group relative flex gap-2.5 items-end my-2.5 ${
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar for incoming */}
        {!isCurrentUser && (
          <UserAvatar
            src={message.sender.profileImageUrl}
            name={message.sender.fullName}
            size="sm"
            className="mb-0.5 ring-2 ring-white shadow-xs"
          />
        )}

        {/* Bubble container */}
        <div
          className={`relative max-w-[82%] sm:max-w-[70%] md:max-w-[62%] flex flex-col ${
            isCurrentUser ? 'items-end' : 'items-start'
          }`}
        >
          {/* Sender header for incoming */}
          {!isCurrentUser && showSenderName && (
            <div className="flex items-center gap-1.5 ml-1 mb-1 text-xs">
              <span className="font-semibold text-[#1F2937]">
                {message.sender.fullName}
              </span>
              {message.sender.role === 'ROLE_EXPERT' && (
                <span className="px-1.5 py-0.5 rounded-sm bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#A5D6A7]">
                  {message.sender.specialization || 'Expert'}
                </span>
              )}
            </div>
          )}

          {/* Main bubble */}
          <div
            className={`relative p-3 sm:p-3.5 shadow-xs transition-all ${
              isCurrentUser
                ? 'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white rounded-2xl rounded-br-xs'
                : 'bg-white border border-[#E5E7EB] text-[#1F2937] rounded-2xl rounded-bl-xs'
            }`}
          >
            {/* Deleted state */}
            {message.deleted ? (
              <p className="italic text-xs opacity-75 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 opacity-60" />
                This message was deleted
              </p>
            ) : (
              <>
                {/* Image attachment */}
                {message.messageType === 'IMAGE' && message.attachmentUrl && (
                  <div className="mb-2 overflow-hidden rounded-xl bg-black/5 relative group/img cursor-pointer">
                    <img
                      src={message.attachmentUrl}
                      alt="Consultation attachment"
                      className="max-h-72 w-auto object-cover rounded-xl transition-transform hover:scale-[1.02]"
                      onClick={() => setImagePreviewOpen(true)}
                      loading="lazy"
                    />
                    <div
                      onClick={() => setImagePreviewOpen(true)}
                      className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1"
                    >
                      <ExternalLink className="w-4 h-4" /> Click to view
                    </div>
                  </div>
                )}

                {/* Text content */}
                {message.content && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}
              </>
            )}

            {/* Timestamp & Status footer */}
            <div
              className={`flex items-center gap-1.5 mt-1 text-[10px] ${
                isCurrentUser ? 'text-emerald-100 justify-end' : 'text-[#9CA3AF] justify-end'
              }`}
            >
              <span>{timeStr}</span>
              {isCurrentUser && (
                <span>
                  {message.deliveryStatus === 'READ' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                  ) : (
                    <Check className="w-3.5 h-3.5 opacity-80" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover action menu trigger */}
        {!message.deleted && (
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity self-center">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1 rounded-full text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#E5E7EB] transition-colors"
              title="Message options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div
                className={`absolute z-30 top-0 ${
                  isCurrentUser ? 'right-full mr-1' : 'left-full ml-1'
                } w-36 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 text-xs animate-in fade-in zoom-in-95`}
              >
                {isCurrentUser && onDelete && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
                {!isCurrentUser && onReport && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setReportModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5 text-amber-500" /> Report
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Message"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Reports are treated confidentially and reviewed by KrishiAI platform administrators.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Reason for reporting
            </label>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe what is inappropriate about this message (e.g. harassment, wrong advice, spam)..."
              rows={3}
              required
              className="w-full p-2.5 text-sm rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingReport || !reportReason.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
            >
              {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Image Lightbox Modal */}
      {imagePreviewOpen && message.attachmentUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setImagePreviewOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={message.attachmentUrl}
              alt="Full preview"
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-3">
              <a
                href={message.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open original
              </a>
              <button
                type="button"
                onClick={() => setImagePreviewOpen(false)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
