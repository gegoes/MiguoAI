import { motion } from "framer-motion";
import { type Message } from "@/hooks/use-chat";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

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
      <div
        className={`relative max-w-[90%] sm:max-w-[80%] px-6 py-5 shadow-sm
          ${isUser
            ? "bg-primary text-primary-foreground rounded-3xl rounded-tr-sm"
            : "bg-card border border-border/50 rounded-3xl rounded-tl-sm text-card-foreground"
          }
        `}
      >
        {isUser ? (
          <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap text-primary-foreground/95">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed opacity-90 [&_.katex]:text-base [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-2">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
