"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, Sprout, CloudSun, ShieldAlert, CheckCircle2, User, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function FarmerAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Namaste! I am your KrishiAI Agricultural Advisor. How can I help you with your crop schedule, soil health, fertilizer ratios, or pest management today?",
      time: "10:00 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Recommended fertilizer dose for flowering tomatoes?",
    "How to prevent tuber rot in rainy season potatoes?",
    "When should I apply first urea top dressing for rice?",
    "Natural remedies for aphids on cabbage",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Based on your region's current climate and Kharif season records: for "${text}", ensure soil moisture is maintained at 60–70% field capacity. Avoid excess nitrogen which increases disease vulnerability. Apply balanced NPK (10:26:26) along with organic compost for root vigor.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0F9F68]">
            AI Assistance
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#171717]">
            Agricultural AI Advisor
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500 font-medium">
            24/7 intelligent farming recommendations tailored to your local soil and climate.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="rounded-2xl sm:rounded-3xl border border-[rgba(234,234,236,0.85)] bg-white shadow-xs overflow-hidden flex flex-col h-[650px] max-h-[75vh]">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  KrishiAI Assistant
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-gray-400">Trained on agronomy, plant pathology, and soil science</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: "1",
                  sender: "ai",
                  text: "Chat cleared. What agricultural questions do you have?",
                  time: "Now",
                },
              ])
            }
            className="text-xs font-semibold text-gray-400 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-xl ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-[#171717] text-white"
                    : "bg-[#0F9F68] text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-[#171717] text-white rounded-tr-none"
                    : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] mt-1.5 block ${
                    msg.sender === "user" ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-400 pl-11">
              <Bot className="w-3.5 h-3.5 text-[#0F9F68] animate-bounce" />
              <span>Analyzing agronomic database...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3.5 sm:px-5 py-2 border-t border-gray-100 bg-slate-50/40 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#0F9F68] hover:text-[#0F9F68] whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fertilizer, pest diagnosis, weather advice..."
            className="flex-1 py-2.5 px-4 rounded-full border border-gray-200 text-xs sm:text-sm text-slate-800 placeholder:text-gray-400 focus:outline-none focus:border-[#0F9F68] focus:ring-2 focus:ring-[#0F9F68]/15 transition-all min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="w-11 h-11 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
