import React, { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Phone, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_PROMPTS = [
  "Hi, I want to know about your 2-3 RPM Bull-Driven Groundnut Oil extraction.",
  "Can you share the latest NABL purity lab test certificate for A2 Cow Ghee?",
  "I have a query about delivery to my area in Bengaluru/Mysuru.",
  "I want to place a bulk / wedding gift hamper order.",
];

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const handleSend = (textToSend?: string) => {
    const text = textToSend || customMsg || "Hi Desiri Naturals, I have a query regarding your products.";
    const url = `https://wa.me/919900088222?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[320px] sm:w-[350px] bg-background border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-600">
                  <MessageCircle className="h-5 w-5 text-emerald-300" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-900" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm">Desiri Farm WhatsApp</div>
                <div className="text-[10px] text-emerald-200">Replies typically in under 5 minutes</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-300 hover:text-white p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-muted/30 space-y-3">
            {/* Greeting bubble */}
            <div className="bg-card p-3 rounded-2xl rounded-tl-none border border-border/60 text-xs text-foreground shadow-xs">
              <p className="font-medium text-emerald-800 dark:text-emerald-400 mb-1">
                Namaskara! 🙏 Welcome to Desiri Naturals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Connect directly with our farm harvesting team in Mysuru. Choose a question below or type your message:
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Quick Inquiries</span>
              </div>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2 rounded-xl border border-border/70 hover:border-emerald-600 bg-background text-[11px] text-foreground hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>

            {/* Free-text input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="pt-2 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 h-9 px-3 text-xs bg-background border rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 w-9 p-0 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-900 border-2 border-white" />
        </span>
        <MessageCircle className="h-6 w-6 fill-current text-white" />
        <span className="hidden sm:inline-block font-semibold text-xs tracking-tight">
          WhatsApp Us
        </span>
      </button>
    </div>
  );
}
