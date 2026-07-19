import { BrainCircuit, Plus, Trash2, MessageSquare, X } from "lucide-react";
import { type Session } from "@/hooks/use-sessions";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  sessions: Session[];
  activeId: string;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

function timeLabel(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function Sidebar({ sessions, activeId, onNew, onSelect, onDelete, onClose }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full w-64 bg-muted/30 border-r border-border/40">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border/40">
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <span className="font-bold text-base tracking-tight flex-1">MiguoAI</span>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* New chat button */}
      <div className="px-3 pt-3 pb-2">
        <Button
          onClick={onNew}
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl border-border/60 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New chat
        </Button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {sessions.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-8 px-4">
            No chats yet. Start a conversation!
          </p>
        )}
        {sessions.map((session) => {
          const active = session.id === activeId;
          return (
            <div
              key={session.id}
              className={`group relative flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                active
                  ? "bg-primary/10 text-foreground"
                  : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onSelect(session.id)}
            >
              <MessageSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${active ? "text-primary" : ""}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate leading-tight">{session.title}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{timeLabel(session.createdAt)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0 mt-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
