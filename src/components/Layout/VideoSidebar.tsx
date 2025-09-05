import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Play, Edit3, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoHistoryItem {
  id: string;
  prompt: string;
  thumbnail: string;
  duration: string;
  timestamp: string;
  model: string;
}

interface VideoSidebarProps {
  onSelectVideo: (videoId: string) => void;
  selectedVideoId: string | null;
}

// Mock video history data
const mockVideos: VideoHistoryItem[] = [
  {
    id: "1",
    prompt: "Cyberpunk cityscape with flying cars at night",
    thumbnail: "/api/placeholder/160/90",
    duration: "00:15",
    timestamp: "2 hours ago",
    model: "Runway Gen-4"
  },
  {
    id: "2", 
    prompt: "Peaceful mountain lake at sunrise with mist",
    thumbnail: "/api/placeholder/160/90",
    duration: "00:12",
    timestamp: "5 hours ago",
    model: "Veo3"
  },
  {
    id: "3",
    prompt: "Abstract geometric shapes morphing",
    thumbnail: "/api/placeholder/160/90", 
    duration: "00:08",
    timestamp: "1 day ago",
    model: "Banana"
  }
];

export function VideoSidebar({ onSelectVideo, selectedVideoId }: VideoSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = mockVideos.filter(video =>
    video.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="w-80 border-r border-border/50 bg-surface">
      <SidebarHeader className="p-6 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">Video History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border/50 focus:border-primary"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-4 space-y-3">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video.id)}
                className={cn(
                  "group relative rounded-lg border border-border/50 p-3 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-secondary/50",
                  selectedVideoId === video.id && "border-primary bg-secondary"
                )}
              >
                {/* Video Thumbnail */}
                <div className="relative mb-3 video-preview">
                  <div className="aspect-video bg-video-bg rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-surface flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>

                  {/* Action Buttons - Show on Hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-2">
                  <p className="text-sm text-foreground line-clamp-2 font-medium">
                    {video.prompt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.timestamp}
                    </div>
                    <div className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                      {video.model}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredVideos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="mb-3">
                  <Search className="h-8 w-8 mx-auto opacity-50" />
                </div>
                <p>No videos found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}