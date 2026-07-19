import { useState } from "react";
import { ImageIcon, Sun, Moon, Menu, Plus, BrainCircuit } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { useSessions } from "@/hooks/use-sessions";

const tabs = [
  { path: "/", label: "Chat", icon: BrainCircuit },
  { path: "/image", label: "Image", icon: ImageIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sessions, activeId, newSession, selectSession, deleteSession } = useSessions();

  const isChat = location === "/";

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">

      {/* Sidebar — desktop always visible, mobile as overlay */}
      {isChat && (
        <>
          {/* Desktop sidebar */}
          <div className="hidden md:flex flex-col h-full shrink-0">
            <Sidebar
              sessions={sessions}
              activeId={activeId}
              onNew={newSession}
              onSelect={selectSession}
              onDelete={deleteSession}
            />
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <div className="relative z-50 h-full">
                <Sidebar
                  sessions={sessions}
                  activeId={activeId}
                  onNew={() => { newSession(); setSidebarOpen(false); }}
                  onSelect={(id) => { selectSession(id); setSidebarOpen(false); }}
                  onDelete={deleteSession}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="flex-none px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-md z-10 sticky top-0">
          {/* Mobile menu / new chat buttons (only on chat page) */}
          {isChat && (
            <>
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={newSession}
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <Plus className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Logo — only show on non-chat or mobile */}
          <div className={`flex items-center gap-2 flex-1 min-w-0 ${isChat ? "md:hidden" : ""}`}>
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-base tracking-tight">MiguoAI</h1>
          </div>

          {/* Spacer on desktop chat page */}
          {isChat && <div className="hidden md:flex flex-1" />}

          {/* Tab switcher */}
          <div className="flex items-center gap-1 bg-muted/60 rounded-full p-1 border border-border/40">
            {tabs.map(({ path, label, icon: Icon }) => {
              const active = location === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full shrink-0"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>

      {/* Decorative noise */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
