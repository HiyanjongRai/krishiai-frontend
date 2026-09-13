"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Send,
  RefreshCw,
  MessageSquare,
  Sprout,
  ShieldCheck,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";
import { consultationMessageService } from "@/services/consultation";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { ConsultationMessage } from "@/types/consultation";

interface ConsultationChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: number | string;
  expertName: string;
  specialization?: string;
  cropName?: string;
}

export function ConsultationChatModal({
  isOpen,
  onClose,
  consultationId,
  expertName,
  specialization,
  cropName,
}: ConsultationChatModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    setError(null);
    try {
      const data = await consultationMessageService.getMessages(consultationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load consultation messages.");
    } finally {
      setIsLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      void fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMessages();
    setIsRefreshing(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setIsSending(true);

    try {
      const newMsg = await consultationMessageService.sendMessage(consultationId, {
        message: text,
      });
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
      setTimeout(scrollToBottom, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send message.";
      toast.error({ title: "Message failed", description: msg });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col h-[85vh] max-h-[750px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center font-black text-sm shrink-0 border border-[#BCE9D5]">
              {expertName.charAt(0) || "E"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                  {expertName}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Specialist
                </span>
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                {specialization && <span>{specialization}</span>}
                {cropName && (
                  <>
                    <span>•</span>
                    <span className="text-[#0F9F68] font-semibold flex items-center gap-0.5">
                      <Sprout className="w-3 h-3" /> {cropName}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-gray-500 hover:text-[#0F9F68] hover:bg-gray-100 transition-colors cursor-pointer"
              title="Refresh messages"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#0F9F68]" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#F8F9FA] space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin text-[#0F9F68]" />
              <p className="text-xs font-semibold">Opening secure consultation thread...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center space-y-2">
              <AlertCircle className="w-5 h-5 mx-auto text-rose-600" />
              <p className="font-semibold">{error}</p>
              <button
                onClick={fetchMessages}
                className="text-xs font-bold underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-2xs">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Start the conversation</p>
                <p className="text-[11px] text-gray-500 mt-0.5 max-w-xs">
                  Ask {expertName} questions regarding symptoms, soil tests, or treatment timelines.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine =
                (user && msg.senderId === user.id) ||
                msg.senderRole === "ROLE_FARMER" ||
                msg.senderRole === "FARMER";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1 px-1">
                    <span className="font-semibold text-gray-600">
                      {isMine ? "You" : msg.senderName || expertName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                      isMine
                        ? "bg-[#0F9F68] text-white rounded-tr-xs"
                        : "bg-white text-gray-800 border border-gray-200/90 rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-end gap-2.5"
        >
          <div className="flex-1 min-w-0">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Type your message to the specialist... (Enter to send, Shift+Enter for new line)"
              disabled={isLoading || isSending}
              className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:border-[#0F9F68] focus:outline-none focus:ring-2 focus:ring-[#0F9F68]/15 resize-none placeholder:text-gray-400 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isSending || isLoading}
            className="px-4 py-3 rounded-2xl bg-[#0F9F68] hover:bg-[#0D8A5A] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
            title="Send message"
          >
            {isSending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
