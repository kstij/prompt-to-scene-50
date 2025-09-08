import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const AI_MODELS = [
  { id: "runway-gen4", name: "Runway Gen-4 Turbo", description: "Latest high-quality model" },
  { id: "veo3", name: "Veo3", description: "Fast and creative" },
  { id: "banana", name: "Banana", description: "Artistic style" },
  { id: "custom", name: "Custom API", description: "Your own model" }
];

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isGenerating) return;

    const content = input.trim();
    setInput("");
    setIsGenerating(true);
    
    try {
      await onSendMessage(content);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Input Area */}
      <div className="relative">
        <div className="relative flex items-end gap-3 p-4 rounded-2xl bg-input border border-border/50 focus-within:border-primary transition-colors">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Chat with Gemini about your video ideas..."
              className="min-h-[60px] max-h-32 resize-none border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 p-0"
              disabled={isGenerating}
            />
          </div>

          <div className="flex items-center gap-2 pb-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isGenerating}
              className={cn(
                "h-8 w-8 p-0 bg-gradient-primary hover:opacity-90 transition-opacity",
                isGenerating && "animate-pulse-glow"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Character Count */}
        <div className="absolute -bottom-5 right-2 text-xs text-muted-foreground">
          {input.length}/500
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2">
        {[
          "Hey, make a video of frog dancing",
          "What can you create for me?", 
          "Add a cow to this scene too",
          "Make it more cinematic",
          "Can you help me with ideas?"
        ].map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setInput(suggestion)}
            className="h-7 text-xs border-border/50 hover:border-primary hover:bg-secondary"
            disabled={isGenerating}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </form>
  );
}