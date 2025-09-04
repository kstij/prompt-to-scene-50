import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string, model: string) => void;
}

const AI_MODELS = [
  { id: "runway-gen4", name: "Runway Gen-4 Turbo", description: "Latest high-quality model" },
  { id: "veo3", name: "Veo3", description: "Fast and creative" },
  { id: "banana", name: "Banana", description: "Artistic style" },
  { id: "custom", name: "Custom API", description: "Your own model" }
];

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("runway-gen4");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isGenerating) return;

    const content = input.trim();
    const model = AI_MODELS.find(m => m.id === selectedModel)?.name || "Runway Gen-4 Turbo";
    
    setInput("");
    setIsGenerating(true);
    
    try {
      await onSendMessage(content, model);
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
      {/* Model Selection */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Model:</span>
        </div>
        
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-64 h-9 bg-input border-border/50 focus:border-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface border-border/50">
            {AI_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="relative flex items-end gap-3 p-4 rounded-2xl bg-input border border-border/50 focus-within:border-primary transition-colors">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the video you want to create..."
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
          "Cyberpunk city at night",
          "Peaceful nature scene", 
          "Abstract art animation",
          "Futuristic robot",
          "Ocean waves"
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