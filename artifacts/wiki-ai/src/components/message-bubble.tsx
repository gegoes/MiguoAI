import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Message } from "@/hooks/use-chat";
import { BrainCircuit, ChevronDown, Sparkles } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [thinkingOpen, setThinkingOpen] = useState(true);

  if (message.status === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full justify-start mb-6"
      >
        <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl p-6 bg-card border border-border/50 shadow-sm rounded-tl-sm flex items-center gap-3 text-muted-foreground">
          <Sparkles className="w-5 h-5 animate-pulse text-primary/70" />
          <span className="text-[15px] font-medium tracking-wide animate-pulse">Thinking…</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`relative max-w-[90%] sm:max-w-[80%] flex flex-col gap-3 ${isUser ? "items-end" : "items-start"}`}>

        {/* Thinking block — only for assistant messages with thinking content */}
        {!isUser && message.thinking && (
          <div className="w-full rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden">
            <button
              onClick={() => setThinkingOpen((o) => !o)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-primary/10 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="text-xs font-semibold text-primary/80 uppercase tracking-widest flex-1">
                DeepThink-v2.3 · Reasoning
              </span>
              <motion.div
                animate={{ rotate: thinkingOpen ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-primary/60" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {thinkingOpen && (
                <motion.div
                  key="thinking"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 max-h-64 overflow-y-auto">
                    <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
                      {message.thinking}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Main message bubble */}
        <div
          className={`px-6 py-5 shadow-sm
            ${isUser
              ? "bg-primary text-primary-foreground rounded-3xl rounded-tr-sm"
              : "bg-card border border-border/50 rounded-3xl rounded-tl-sm text-card-foreground"
            }
          `}
        >
          <p
            className={`text-[15px] leading-relaxed font-medium whitespace-pre-wrap ${
              isUser ? "text-primary-foreground/95" : "opacity-90"
            }`}
          >
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
