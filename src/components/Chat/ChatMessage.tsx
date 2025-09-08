import { Button } from "@/components/ui/button";
import { VideoPlayer } from "./VideoPlayer";
import { Play, Edit3, Download, RefreshCw, Sparkles, Brain, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./ChatInterface";

interface ChatMessageProps {
  message: Message;
  onEdit: () => void;
}

export function ChatMessage({ message, onEdit }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  const isAI = message.type === 'ai';

  return (
    <div className={cn(
      "flex gap-4 animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row",
      isSystem && "justify-center"
    )}>
      {/* Avatar - Different for system messages */}
      {!isSystem && (
        <div className={cn(
          "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
          isUser 
            ? "bg-gradient-primary text-white" 
            : "bg-secondary text-secondary-foreground border border-border/50"
        )}>
          {isUser ? (
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
              U
            </div>
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-2xl",
        isUser ? "text-right" : "text-left",
        isSystem && "max-w-md text-center"
      )}>
        <div className={cn(
          "inline-block p-4 rounded-2xl shadow-elegant",
          isUser 
            ? "chat-bubble-user text-right" 
            : isSystem
            ? "bg-muted/50 border border-border/30 text-muted-foreground"
            : "chat-bubble-ai"
        )}>
          {/* Enhanced prompt display for system messages */}
          {isSystem && message.enhancedPrompt && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Brain className="h-4 w-4" />
                <span className="text-xs font-medium">Gemini Enhanced</span>
              </div>
              {message.originalPrompt && (
                <div className="text-xs text-muted-foreground mb-2">
                  Original: "{message.originalPrompt}"
                </div>
              )}
            </div>
          )}

          {/* Text Content */}
          <p className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap",
            isSystem && "text-center"
          )}>
            {message.content}
          </p>

          {/* Enhancement Loading State */}
          {message.isEnhancing && (
            <div className="mt-2 flex items-center gap-2 text-sm opacity-70 justify-center">
              <Brain className="h-4 w-4 animate-pulse" />
              <span>Enhancing with Gemini...</span>
            </div>
          )}

          {/* Generation Loading State */}
          {message.isGenerating && (
            <div className="mt-3 flex items-center gap-2 text-sm opacity-70">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating video{message.model ? ` with ${message.model}` : ''}...</span>
            </div>
          )}

          {/* Video Preview */}
          {message.videoUrl && !message.isGenerating && (
            <div className="mt-4">
              <VideoPlayer
                src={message.videoUrl}
                poster="/api/placeholder/640/360"
                className="rounded-lg overflow-hidden"
              />
              
              {/* Video Actions */}
              <div className="mt-3 flex items-center gap-2 justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onEdit}
                  className="h-8 text-xs"
                >
                  <Edit3 className="h-3 w-3 mr-1.5" />
                  Edit
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs"
                >
                  <Download className="h-3 w-3 mr-1.5" />
                  Download
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp - Hide for system messages */}
        {!isSystem && (
          <div className={cn(
            "text-xs text-muted-foreground mt-2",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}