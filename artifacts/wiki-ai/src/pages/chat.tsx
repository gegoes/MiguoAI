import { useState, useRef, useEffect, useCallback } from "react";
import { SendHorizonal } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useSessions } from "@/hooks/use-sessions";
import { type Message } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { MessageBubble } from "@/components/message-bubble";

export default function ChatPage() {
  const { sessions, activeId, activeSession, newSession, selectSession, deleteSession, updateMessages } = useSessions();
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages: Message[] = activeSession?.messages ?? [];

  const setMessages = useCallback(
    (updater: (prev: Message[]) => Message[]) => {
      const current = activeSession?.messages ?? [];
      const next = updater(current);
      if (activeId) updateMessages(activeId, next);
    },
    [activeId, activeSession, updateMessages]
  );

  const { sendMessage, isLoading } = useChat(messages, setMessages);

  // Auto-create a session if none exist
  useEffect(() => {
    if (sessions.length === 0) newSession();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      // Start a new session if current one is empty
      if (messages.length === 0 && !activeId) newSession();
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-8 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto w-full flex flex-col min-h-full">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center">
              <EmptyState onSuggest={(text) => { sendMessage(text); }} />
            </div>
          ) : (
            <div className="flex flex-col justify-end min-h-full pb-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="flex-none p-4 sm:p-6 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="max-w-3xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="pr-16 text-[15px] shadow-sm bg-card border-border/60 focus-visible:ring-primary/20"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSubmit();
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 h-9 w-9 rounded-full transition-transform active:scale-95"
            >
              <SendHorizonal className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="text-center mt-3 text-xs text-muted-foreground/70 font-medium tracking-wide">
            MiguoAI · Made by Mingguo · May occasionally be inaccurate.
          </p>
        </div>
      </div>
    </div>
  );
}
