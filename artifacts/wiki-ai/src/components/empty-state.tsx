import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "Why is 1 + 1 equal to 2?",
  "How does the internet actually work?",
  "What is quantum entanglement?",
  "Explain the Roman Empire in 3 sentences",
  "What causes black holes?",
];

interface EmptyStateProps {
  onSuggest: (text: string) => void;
}

export function EmptyState({ onSuggest }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm border border-primary/20">
        <BrainCircuit className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-serif font-semibold text-foreground mb-4">
        Ask anything.
      </h1>

      <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
        Powered by Groq AI — ask any question and get a clear, thoughtful answer instantly.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {SUGGESTIONS.map((suggestion, i) => (
          <Button
            key={suggestion}
            variant="outline"
            className="rounded-full bg-card hover:bg-primary hover:text-primary-foreground border-border/60 transition-all duration-300 shadow-sm animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
            style={{ animationDelay: `${200 + i * 100}ms` }}
            onClick={() => onSuggest(suggestion)}
            data-testid={`btn-suggest-${i}`}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
