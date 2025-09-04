import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Video, 
  Music, 
  Type, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Plus,
  Layers,
  Volume2,
  VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoEditData } from "../ChatInterface";

interface TimelineProps {
  editData: VideoEditData;
  currentTime: number;
  onCurrentTimeChange: (time: number) => void;
  onDataChange: (data: Partial<VideoEditData>) => void;
  selectedLayer: string | null;
  onLayerSelect: (layerId: string | null) => void;
  zoom: number;
}

interface TimelineLayer {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  startTime: number;
  duration: number;
  visible: boolean;
  locked: boolean;
  color: string;
}

const mockLayers: TimelineLayer[] = [
  {
    id: 'video-1',
    name: 'Main Video',
    type: 'video',
    startTime: 0,
    duration: 30,
    visible: true,
    locked: false,
    color: 'hsl(var(--primary))'
  },
  {
    id: 'text-1',
    name: 'Title Text',
    type: 'text',
    startTime: 2,
    duration: 5,
    visible: true,
    locked: false,
    color: 'hsl(var(--accent))'
  },
  {
    id: 'audio-1',
    name: 'Background Music',
    type: 'audio',
    startTime: 0,
    duration: 25,
    visible: true,
    locked: false,
    color: 'hsl(var(--success))'
  }
];

export function Timeline({ 
  editData, 
  currentTime, 
  onCurrentTimeChange, 
  onDataChange,
  selectedLayer,
  onLayerSelect,
  zoom 
}: TimelineProps) {
  const [layers] = useState<TimelineLayer[]>(mockLayers);
  const totalDuration = 30;
  const pixelsPerSecond = (zoom / 100) * 20;
  const timelineWidth = totalDuration * pixelsPerSecond;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, '0')}`;
  };

  const getLayerIcon = (type: TimelineLayer['type']) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      case 'text': return Type;
      case 'effect': return Layers;
      default: return Video;
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / pixelsPerSecond);
    onCurrentTimeChange(Math.max(0, Math.min(totalDuration, time)));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Timeline Header */}
      <div className="h-12 bg-card border-b border-border/50 flex items-center px-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Timeline</span>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Layer
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        {/* Layer Names Panel */}
        <div className="w-48 bg-surface border-r border-border/50">
          <div className="h-10 bg-card border-b border-border/50 flex items-center px-3">
            <span className="text-xs font-medium text-muted-foreground">LAYERS</span>
          </div>
          
          <ScrollArea className="h-[calc(100%-2.5rem)]">
            {layers.map((layer) => {
              const Icon = getLayerIcon(layer.type);
              return (
                <div
                  key={layer.id}
                  className={cn(
                    "h-12 flex items-center gap-2 px-3 border-b border-border/30 cursor-pointer transition-colors",
                    selectedLayer === layer.id 
                      ? "bg-primary/20 border-primary/50" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{layer.name}</span>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle visibility
                      }}
                    >
                      {layer.visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle lock
                      }}
                    >
                      {layer.locked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Unlock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                    
                    {layer.type === 'audio' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>
        
        {/* Timeline Tracks */}
        <div className="flex-1 overflow-x-auto">
          <div className="relative">
            {/* Time Ruler */}
            <div className="h-10 bg-card border-b border-border/50 sticky top-0 z-10">
              <div 
                className="relative h-full"
                style={{ width: timelineWidth }}
              >
                {/* Time markers */}
                {Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full flex flex-col justify-between text-xs text-muted-foreground"
                    style={{ left: i * pixelsPerSecond }}
                  >
                    <div className="h-2 w-px bg-border" />
                    <span className="px-1">{formatTime(i)}</span>
                    <div className="h-2 w-px bg-border" />
                  </div>
                ))}
                
                {/* Playhead */}
                <div
                  className="absolute top-0 w-px h-full bg-primary z-20 pointer-events-none"
                  style={{ left: currentTime * pixelsPerSecond }}
                >
                  <div className="w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 absolute top-1/2" />
                </div>
              </div>
            </div>
            
            {/* Track Area */}
            <div 
              className="relative cursor-crosshair"
              style={{ width: timelineWidth, minHeight: layers.length * 48 }}
              onClick={handleTimelineClick}
            >
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="absolute h-12 border-b border-border/30"
                  style={{ 
                    top: index * 48,
                    width: '100%'
                  }}
                >
                  {/* Layer clip */}
                  <div
                    className={cn(
                      "absolute h-10 mt-1 rounded border-2 cursor-pointer transition-all",
                      "bg-gradient-to-r from-transparent to-white/10",
                      selectedLayer === layer.id 
                        ? "border-primary shadow-glow-primary" 
                        : "border-border hover:border-primary/50"
                    )}
                    style={{
                      left: layer.startTime * pixelsPerSecond,
                      width: layer.duration * pixelsPerSecond,
                      backgroundColor: layer.color + '40',
                      borderColor: selectedLayer === layer.id ? layer.color : undefined
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerSelect(layer.id);
                    }}
                  >
                    <div className="px-2 py-1 text-xs font-medium text-white truncate">
                      {layer.name}
                    </div>
                    
                    {/* Resize handles */}
                    <div className="absolute left-0 top-0 w-2 h-full bg-white/20 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="absolute right-0 top-0 w-2 h-full bg-white/20 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}