import { BrainCircuit, ImageIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const tabs = [
  { path: "/", label: "Chat", icon: BrainCircuit },
  { path: "/image", label: "Image", icon: ImageIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [location, navigate] = useLocation();

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden relative">
      {/* Header */}
      <header className="flex-none px-6 py-4 flex items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-md z-10 sticky top-0">
        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-xl font-bold tracking-tight">MiguoAI</h1>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Powered by Groq</p>
        </div>

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
