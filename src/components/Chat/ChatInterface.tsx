import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { EditPanel } from "./EditPanel";

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  videoUrl?: string;
  isGenerating?: boolean;
  timestamp: string;
}

export interface VideoEditData {
  trim?: { start: number; end: number };
  crop?: string;
  text?: { content: string; position: string };
  music?: string;
  filters?: Record<string, number>;
}

interface ChatInterfaceProps {
  selectedVideoId: string | null;
  onClearSelection: () => void;
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

export function ChatInterface({ selectedVideoId, onClearSelection }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai", 
      content: "Welcome to AI Video Studio! I can help you create amazing videos. Just describe what you want to see and I'll generate it for you. You can also edit and enhance your videos with simple prompts.",
      timestamp: new Date().toISOString()
    }
  ]);
  
  // Get messages for selected video or default messages
  const displayMessages = selectedVideoId 
    ? videoChats[selectedVideoId] || []
    : messages;
  
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editData, setEditData] = useState<VideoEditData>({});

  const handleSendMessage = async (content: string, model: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);

    // Add AI response with loading state
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: `Generating your video with ${model}...`,
      isGenerating: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiMessage]);

    // Simulate video generation
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? {
              ...msg,
              content: `I've created your video: "${content}"`,
              videoUrl: "/api/placeholder/640/360", // Mock video
              isGenerating: false
            }
          : msg
      ));
    }, 3000);
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