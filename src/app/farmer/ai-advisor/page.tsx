"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  User,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Leaf,
  Loader2,
  Copy,
  Check,
  Sprout,
  Calendar,
  Award,
  Users,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { sendAdvisorMessage, type ChatTurn } from "@/services/advisor-service";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  isError?: boolean;
}

interface PromptCategory {
  id: string;
  label: string;
  icon: string;
  prompts: string[];
}

const CATEGORIES: PromptCategory[] = [
  {
    id: "all",
    label: "All Topics",
    icon: "🌾",
    prompts: [
      "Recommended fertilizer dose for flowering tomatoes?",
      "How to prevent tuber rot in rainy season potatoes?",
      "When should I apply first urea top dressing for rice?",
      "Natural remedies for aphids on cabbage",
      "Signs of nitrogen deficiency in wheat?",
      "Best time to plant maize in monsoon season?",
    ],
  },
  {
    id: "disease",
    label: "Pests & Diseases",
    icon: "🐛",
    prompts: [
      "How to control early blight in tomatoes organically?",
      "What causes yellow leaf curl virus and how to stop whiteflies?",
      "Safe dosage of Mancozeb for potato late blight?",
      "Natural neem oil spray preparation for vegetable crops",
    ],
  },
  {
    id: "fertilizer",
    label: "Fertilizer & Soil",
    icon: "🧪",
    prompts: [
      "NPK ratio recommended for potato vegetative stage?",
      "How to correct highly acidic soil (pH below 5.5)?",
      "How to apply zinc sulfate in paddy fields?",
      "Best organic compost mix for kitchen garden vegetables",
    ],
  },
  {
    id: "irrigation",
    label: "Water & Irrigation",
    icon: "💧",
    prompts: [
      "How often to irrigate drip-fed tomatoes during fruiting?",
      "Water management schedule for high-yield wheat crop",
      "Signs of overwatering vs underwatering in bell peppers",
    ],
  },
  {
    id: "calendar",
    label: "Crop Timing",
    icon: "📅",
    prompts: [
      "Best sowing dates for winter cauliflower in mid-hills?",
      "Kharif season harvesting indicators for maize",
      "When to transplant paddy seedlings after nursery germination?",
    ],
  },
];

const WELCOME_TEXT =
  "Namaste! 🌱 I am your KrishiAI Agricultural Advisor, powered by Google Gemini. I specialize in crop health, disease treatments, fertilizer dosage, irrigation schedules, and soil management. Select a suggested topic below or ask any farming question.";

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toGeminiHistory(messages: Message[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  const conversationMsgs = messages.slice(1);
  for (const msg of conversationMsgs) {
    if (msg.isError) continue;
    turns.push({
      role: msg.sender === "user" ? "user" : "model",
      text: msg.text,
    });
  }
  return turns;
}

function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          const headingText = trimmed.replace(/^#+\s*/, "");
          return (
            <p key={idx} className="font-bold text-[#1F2937] text-xs sm:text-sm pt-1">
              {headingText}
            </p>
          );
        }

        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const bulletText = trimmed.replace(/^[\*\-•]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="text-[#2E7D32] font-black text-xs leading-none mt-0.5">•</span>
              <span className="flex-1 text-[#374151]">{renderFormattedSpan(bulletText)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s*(.+)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="text-[#2E7D32] font-bold text-xs mt-0.5">{numMatch[1]}.</span>
              <span className="flex-1 text-[#374151]">{renderFormattedSpan(numMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[#374151]">
            {renderFormattedSpan(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderFormattedSpan(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-[#1F2937]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

let msgIdCounter = 100;

export default function FarmerAdvisorPage() {
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: WELCOME_TEXT,
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend ?? input).trim();
      if (!text || isLoading) return;

      const userMsg: Message = {
        id: `u-${msgIdCounter++}`,
        sender: "user",
        text,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInput("");
      setIsLoading(true);

      try {
        const history = toGeminiHistory(messages);
        const response = await sendAdvisorMessage(text, history);

        const aiMsg: Message = {
          id: `ai-${msgIdCounter++}`,
          sender: "ai",
          text: response.reply,
          time: formatTime(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const errorText =
          err instanceof ApiError
            ? err.status === 401
              ? "Please log in to use the AI Advisor."
              : err.message
            : "The AI Advisor is temporarily unavailable. Please try again.";

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${msgIdCounter++}`,
            sender: "ai",
            text: `⚠️ ${errorText}`,
            time: formatTime(),
            isError: true,
          },
        ]);

        toast.error({ title: "Advisor Error", description: errorText });
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, isLoading, messages, toast]
  );

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: "Conversation cleared. What agricultural questions do you have? Select a topic below or type your question.",
        time: formatTime(),
      },
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success({
      title: "Copied to clipboard",
      description: "Advice copied successfully.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentPrompts =
    CATEGORIES.find((c) => c.id === activeCategory)?.prompts || CATEGORIES[0].prompts;

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] space-y-3">
      {/* ─── 1. COMPACT PAGE HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#E5E7EB] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
              <Bot className="w-4 h-4" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
              Agricultural AI Advisor
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-0.5">
            24/7 Gemini guidance on disease treatments, fertilizer dosing, irrigation &amp; soil health.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors shadow-2xs cursor-pointer disabled:opacity-40"
            title="Clear chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <Link href="/farmer/experts">
            <Button variant="outline" size="sm" className="rounded-lg py-1 px-3 text-xs">
              <Award className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
              <span>Consult Agronomist</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. SLEEK HORIZONTAL CAPABILITY STRIP (Compact & Not Bloated) ──── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 shrink-0">
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB]/80 rounded-xl px-3 py-2 shadow-2xs">
          <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider truncate">Engine</p>
            <p className="text-xs font-bold text-[#1F2937] truncate">Google Gemini</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB]/80 rounded-xl px-3 py-2 shadow-2xs">
          <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
            <Sprout className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider truncate">Coverage</p>
            <p className="text-xs font-bold text-[#1F2937] truncate">15+ Crop Species</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB]/80 rounded-xl px-3 py-2 shadow-2xs">
          <div className="w-6 h-6 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0">
            <Calendar className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider truncate">Seasons</p>
            <p className="text-xs font-bold text-[#1F2937] truncate">Kharif &amp; Rabi</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB]/80 rounded-xl px-3 py-2 shadow-2xs">
          <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <Users className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider truncate">Escalation</p>
            <p className="text-xs font-bold text-[#1F2937] truncate">Expert On-Call</p>
          </div>
        </div>
      </div>

      {/* ─── 3. MAIN CHAT WORKSPACE (Fills remaining height, Input always visible) ─ */}
      <div className="flex-1 min-h-0 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden flex flex-col">
        {/* Advisory Ribbon */}
        <div className="px-3 py-1.5 bg-[#FFFBEB] border-b border-[#FDE68A] flex items-center gap-2 shrink-0 text-[10px] text-[#92400E]">
          <AlertTriangle className="w-3 h-3 text-[#D97706] shrink-0" />
          <span className="truncate">
            <strong>Advisory Notice:</strong> AI advice is for general guidance. Always confirm chemical dosages with a certified local agronomist.
          </span>
        </div>

        {/* Message Thread (Scrollable internally) */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === "user" ? "flex-row-reverse ml-auto max-w-xl" : "max-w-3xl"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-[#1F2937] text-white"
                    : msg.isError
                    ? "bg-[#DC2626] text-white"
                    : "bg-[#E8F5E9] text-[#2E7D32]"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-3.5 h-3.5" />
                ) : msg.isError ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`relative rounded-2xl p-3 sm:p-4 shadow-2xs max-w-full ${
                  msg.sender === "user"
                    ? "bg-[#1F2937] text-white rounded-tr-xs"
                    : msg.isError
                    ? "bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-tl-xs"
                    : "bg-[#F8FAF8] border border-[#EEF0EE] text-[#1F2937] rounded-tl-xs space-y-1.5"
                }`}
              >
                {msg.sender === "ai" && !msg.isError && (
                  <div className="flex items-center justify-between gap-2 border-b border-[#EEF0EE] pb-1.5 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#2E7D32] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Agronomy Advisor</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[#9CA3AF] hover:text-[#2E7D32] transition-colors p-0.5 rounded hover:bg-white cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-[#2E7D32]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}

                {msg.sender === "user" ? (
                  <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <FormattedMessageText text={msg.text} />
                )}

                <span
                  className={`text-[9px] mt-1 block font-medium ${
                    msg.sender === "user" ? "text-white/60" : "text-[#9CA3AF]"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5 max-w-2xl">
              <div className="w-7 h-7 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#F8FAF8] border border-[#EEF0EE] rounded-2xl rounded-tl-xs p-3 shadow-2xs space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#2E7D32]">
                  Agronomy Advisor
                </span>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <Loader2 className="w-3.5 h-3.5 text-[#2E7D32] animate-spin" />
                  <span>Consulting Google Gemini agronomy knowledge base...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ─── 4. TOPIC CHIPS & QUICK PROMPTS ─────────────────────────────────── */}
        <div className="border-t border-[#F1F5F2] bg-[#F8FAF8] p-2 sm:p-2.5 space-y-2 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                  activeCategory === cat.id
                    ? "bg-[#2E7D32] text-white shadow-2xs"
                    : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#C8E6C9]"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {currentPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#2E7D32] hover:text-[#2E7D32] whitespace-nowrap transition-colors cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shrink-0"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-3 h-3 text-[#9CA3AF]" />
              </button>
            ))}
          </div>
        </div>

        {/* ─── 5. INPUT BAR (Always visible at bottom) ────────────────────────── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2.5 sm:p-3 border-t border-[#E5E7EB] bg-white flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about fertilizer dose, yellow leaves, pest remedies, crop timing..."
            disabled={isLoading}
            className="flex-1 py-2 px-3.5 rounded-full bg-[#F8FAF8] border border-[#E5E7EB] text-xs sm:text-[13px] text-[#1F2937] placeholder:text-[#9CA3AF] focus:bg-white focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]/20 transition-all min-h-[38px] disabled:opacity-60"
          />

          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            isLoading={isLoading}
            size="sm"
            className="rounded-full px-4 min-h-[38px]"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
