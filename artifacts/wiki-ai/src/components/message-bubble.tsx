import { motion } from "framer-motion";
import { type Message } from "@/hooks/use-chat";
import { ExternalLink, BookOpen } from "lucide-react";

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
          <BookOpen className="w-5 h-5 animate-pulse text-primary/60" />
          <span className="text-[15px] font-medium tracking-wide animate-pulse">Searching the archives...</span>
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
        {!isUser && message.data && (
          <div className="flex flex-col sm:flex-row gap-6 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 tracking-tight text-foreground">
                {message.data.title}
              </h3>
              <p className="text-[15px] leading-relaxed opacity-90 font-medium">
                {message.content}
              </p>
            </div>
            
            {message.data.thumbnail && (
              <div className="shrink-0 sm:w-32 sm:h-32 w-full h-48 overflow-hidden rounded-xl border border-border/30 bg-muted/30">
                <img 
                  src={message.data.thumbnail.source} 
                  alt={message.data.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}
        
        {!isUser && !message.data && (
          <p className="text-[15px] leading-relaxed font-medium">
            {message.content}
          </p>
        )}
        
        {isUser && (
          <p className="text-[16px] leading-relaxed font-medium text-primary-foreground/95">
            {message.content}
          </p>
        )}

        {!isUser && message.data && (
          <div className="mt-5 pt-4 border-t border-border/40 flex items-center">
            <a 
              href={message.data.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
              data-testid={`link-wikipedia-${message.data.title}`}
            >
              Read full article on Wikipedia
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
