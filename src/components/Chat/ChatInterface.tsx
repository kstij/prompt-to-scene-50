import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit3, Sparkles, Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { EditPanel } from "./EditPanel";
import { GeminiService } from "@/services/geminiService";
import { VideoGenerationService } from "@/services/videoGenerationService";

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  videoUrl?: string;
  isGenerating?: boolean;
  isEnhancing?: boolean;
  enhancedPrompt?: string;
  originalPrompt?: string;
  timestamp: string;
  model?: string;
}

export interface VideoEditData {
  trim?: { start: number; end: number };
  crop?: string;
  text?: { 
    content: string; 
    position: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    x?: number;
    y?: number;
  };
  music?: string;
  filters?: Record<string, number>;
}

interface ChatInterfaceProps {
  selectedVideoId: string | null;
  onClearSelection: () => void;
  selectedModel: string;
}

// Mock chat data for videos
const videoChats: Record<string, Message[]> = {
  "1": [
    {
      id: "user-1-1",
      type: "user",
      content: "Create a cyberpunk cityscape with flying cars at night",
      timestamp: "2024-01-01T10:00:00Z"
    },
    {
      id: "ai-1-1", 
      type: "ai",
      content: "I've created your cyberpunk cityscape video with flying cars at night",
      videoUrl: "/api/placeholder/640/360",
      timestamp: "2024-01-01T10:02:00Z"
    }
  ],
  "2": [
    {
      id: "user-2-1",
      type: "user", 
      content: "Generate a peaceful mountain lake at sunrise with mist",
      timestamp: "2024-01-01T07:00:00Z"
    },
    {
      id: "ai-2-1",
      type: "ai",
      content: "I've created your peaceful mountain lake video at sunrise with beautiful mist effects",
      videoUrl: "/api/placeholder/640/360", 
      timestamp: "2024-01-01T07:02:00Z"
    }
  ],
  "3": [
    {
      id: "user-3-1",
      type: "user",
      content: "Create abstract geometric shapes morphing",
      timestamp: "2024-01-01T06:00:00Z"
    },
    {
      id: "ai-3-1",
      type: "ai",
      content: "I've created your abstract geometric shapes morphing video",
      videoUrl: "/api/placeholder/640/360",
      timestamp: "2024-01-01T06:02:00Z"
    }
  ]
};

export function ChatInterface({ selectedVideoId, onClearSelection, selectedModel }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai", 
      content: "Welcome to AI Video Studio! 🎬 I'm your AI video creation assistant. Just describe what you want to see and I'll enhance your prompt with Gemini and generate amazing videos for you. You can also refine videos with follow-up requests!",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const geminiService = GeminiService.getInstance();
  const videoService = VideoGenerationService.getInstance();
  
  // Get messages for selected video or default messages
  const displayMessages = selectedVideoId 
    ? videoChats[selectedVideoId] || []
    : messages;
  
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editData, setEditData] = useState<VideoEditData>({});

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, content]);

    // Step 1: Show enhancement phase
    const enhancingMessageId = `enhancing-${Date.now()}`;
    const enhancingMessage: Message = {
      id: enhancingMessageId,
      type: 'system',
      content: "🧠 Gemini is enhancing your prompt...",
      isEnhancing: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, enhancingMessage]);

    try {
      // Step 2: Get enhanced prompt from Gemini
      const enhanced = await geminiService.enhancePrompt(content, conversationHistory);
      
      // Update enhancing message to show enhanced prompt
      setMessages(prev => prev.map(msg => 
        msg.id === enhancingMessageId 
          ? {
              ...msg,
              content: `✨ Enhanced prompt: "${enhanced.enhancedPrompt}"`,
              isEnhancing: false,
              enhancedPrompt: enhanced.enhancedPrompt,
              originalPrompt: enhanced.originalPrompt
            }
          : msg
      ));

      // Step 3: Start video generation
      const generatingMessageId = `generating-${Date.now()}`;
      const modelName = videoService.getModelDisplayName(selectedModel);
      const generatingMessage: Message = {
        id: generatingMessageId,
        type: 'ai',
        content: `🎬 Generating video with ${modelName}...`,
        isGenerating: true,
        model: modelName,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, generatingMessage]);

      // Step 4: Generate video
      const videoResult = await videoService.generateVideo(enhanced, selectedModel);
      
      // Update generating message with final result
      setMessages(prev => prev.map(msg => 
        msg.id === generatingMessageId 
          ? {
              ...msg,
              content: `✅ Your video is ready! Generated with ${modelName}`,
              videoUrl: videoResult.videoUrl,
              isGenerating: false
            }
          : msg
      ));

    } catch (error) {
      console.error('Error in video generation:', error);
      setMessages(prev => prev.filter(msg => 
        msg.id !== enhancingMessageId && msg.id !== `generating-${Date.now()}`
      ));
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: "Sorry, there was an error generating your video. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleEditVideo = (messageId: string) => {
    setEditingVideoId(messageId);
    setEditData({});
  };

  const handleSaveEdit = (data: VideoEditData) => {
    // Here you would apply the edits to the video
    console.log('Saving edit data:', data);
    setEditingVideoId(null);
    setEditData({});
    
    // Add a new message showing the edited version
    const editMessage: Message = {
      id: `edit-${Date.now()}`,
      type: 'ai',
      content: "I've applied your edits to the video.",
      videoUrl: "/api/placeholder/640/360", // Mock edited video
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, editMessage]);
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Video Chat Header */}
      {selectedVideoId && (
        <div className="border-b border-border/50 bg-surface px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Video Chat History
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditVideo(displayMessages.find(m => m.videoUrl)?.id || '')}
                className="text-primary border-primary hover:bg-primary/10"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Video
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="text-muted-foreground"
              >
                Back to Chat
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            {displayMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onEdit={() => handleEditVideo(message.id)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input - Only show for new chat, not for video history */}
        {!selectedVideoId && (
          <div className="border-t border-border/50 bg-surface">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        )}
      </div>

      {/* Edit Panel */}
      {editingVideoId && (
        <EditPanel
          videoId={editingVideoId}
          editData={editData}
          onSave={handleSaveEdit}
          onCancel={() => setEditingVideoId(null)}
          onDataChange={setEditData}
        />
      )}
    </div>
  );
}