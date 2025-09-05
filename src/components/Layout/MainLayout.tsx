import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { VideoSidebar } from "./VideoSidebar";
import { ChatInterface } from "../Chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";

export function MainLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  return (
    <SidebarProvider>
        <div 
          className="min-h-screen w-full flex bg-background relative"
        >

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-surface border-b border-border">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="text-foreground hover:bg-muted"
              >
                {sidebarVisible ? <PanelLeftClose /> : <PanelLeftOpen />}
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center animate-glow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">AI Video Studio</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground animate-float">
                Next-gen AI video creation ✨
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex w-full pt-16 relative z-10">
          {sidebarVisible && (
            <VideoSidebar 
              onSelectVideo={setSelectedVideoId}
              selectedVideoId={selectedVideoId}
            />
          )}
          
          <main className="flex-1 min-h-screen">
            <ChatInterface 
              selectedVideoId={selectedVideoId}
              onClearSelection={() => setSelectedVideoId(null)}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}