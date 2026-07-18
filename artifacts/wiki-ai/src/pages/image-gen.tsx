import { useState } from "react";
import { Download, ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function buildImageUrl(prompt: string) {
  const encoded = encodeURIComponent(prompt.trim());
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&model=flux&seed=${Math.floor(Math.random() * 999999)}`;
}

type Status = "idle" | "loading" | "done" | "error";

export default function ImageGenPage() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const generate = () => {
    if (!input.trim()) return;
    const url = buildImageUrl(input.trim());
    setPrompt(input.trim());
    setImageUrl(url);
    setStatus("loading");
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") generate();
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `miguoai-${Date.now()}.jpg`;
    a.target = "_blank";
    a.click();
  };

  const SUGGESTIONS = [
    "A futuristic city at sunset",
    "A cozy coffee shop in the rain",
    "An astronaut riding a horse on Mars",
    "A dragon made of crystal and light",
    "A serene Japanese garden in autumn",
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 sm:px-6 md:px-8 py-10">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">

        {/* Input row */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want..."
            className="text-[15px] bg-card border-border/60 focus-visible:ring-primary/20"
            data-testid="input-image-prompt"
          />
          <Button
            onClick={generate}
            disabled={!input.trim() || status === "loading"}
            className="shrink-0 gap-2"
            data-testid="button-generate"
          >
            <Sparkles className="w-4 h-4" />
            Generate
          </Button>
        </div>

        {/* Result area */}
        {status === "idle" && (
          <div className="flex flex-col items-center gap-6 py-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground text-[15px] max-w-sm">
              Type a description above and hit Generate — your image appears here in seconds.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-sm px-4 py-2 rounded-full border border-border/60 bg-card hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-muted-foreground hover:border-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {(status === "loading" || status === "done") && imageUrl && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground italic">"{prompt}"</p>
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-md bg-muted/30 min-h-[300px] flex items-center justify-center">
              {status === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground z-10 bg-background/60 backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 animate-pulse text-primary/70" />
                  <span className="text-sm font-medium animate-pulse">Generating your image…</span>
                </div>
              )}
              <img
                src={imageUrl}
                alt={prompt}
                className="w-full rounded-2xl object-cover"
                onLoad={() => setStatus("done")}
                onError={() => setStatus("error")}
              />
            </div>
            {status === "done" && (
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="ghost" onClick={() => { setStatus("idle"); setImageUrl(null); }}>
                  Start over
                </Button>
              </div>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Something went wrong generating the image. Please try again.</p>
            <Button variant="ghost" className="mt-3" onClick={() => { setStatus("idle"); setImageUrl(null); }}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
