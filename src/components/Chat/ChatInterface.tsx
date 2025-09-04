import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai", 
      content: "Welcome to AI Video Studio! I can help you create amazing videos. Just describe what you want to see and I'll generate it for you. You can also edit and enhance your videos with simple prompts.",
      timestamp: new Date().toISOString()
    }
  ]);
  
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
      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onEdit={() => handleEditVideo(message.id)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-border/50 bg-surface">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
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