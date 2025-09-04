import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize2,
  RotateCcw,
  Grid3X3,
  Move,
  ZoomIn,
  ZoomOut,
  Crosshair
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoEditData } from "../ChatInterface";

interface PreviewPanelProps {
  videoId: string;
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  editData: VideoEditData;
}

export function PreviewPanel({ 
  videoId, 
  currentTime, 
  isPlaying, 
  onTimeChange, 
  onPlayPause,
  editData 
}: PreviewPanelProps) {
  const [volume, setVolume] = useState(100);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  return (
    <div className="h-full flex flex-col bg-card/20">
      {/* Preview Controls */}
      <div className="h-12 bg-surface/50 border-b border-border/30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className={cn("h-3 w-3", showGrid && "text-primary")} />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Move className="h-3 w-3" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Crosshair className="h-3 w-3" />
          </Button>
          
          <div className="flex items-center gap-1 ml-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => setPreviewZoom(Math.max(25, previewZoom - 25))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[40px] text-center">
              {previewZoom}%
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Video Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="relative">
          {/* Video Container */}
          <Card 
            className="relative overflow-hidden shadow-elegant border-2 border-border/50"
            style={{
              width: `${400 * (previewZoom / 100)}px`,
              height: `${225 * (previewZoom / 100)}px`,
              aspectRatio: editData.crop === '9:16' ? '9/16' : 
                          editData.crop === '1:1' ? '1/1' : 
                          editData.crop === '4:3' ? '4/3' : '16/9'
            }}
          >
            {/* Background placeholder */}
            <div className="absolute inset-0 bg-gradient-hero opacity-50" />
            
            {/* Grid overlay */}
            {showGrid && (
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}
            
            {/* Video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Video Preview</p>
                <p className="text-xs opacity-70">{Math.floor(currentTime)}s / 30s</p>
              </div>
            </div>
            
            {/* Text overlay preview */}
            {editData.text?.content && (
              <div 
                className={cn(
                  "absolute left-4 right-4 text-white text-center font-bold text-lg drop-shadow-lg",
                  editData.text.position === 'top' && 'top-4',
                  editData.text.position === 'center' && 'top-1/2 -translate-y-1/2',
                  editData.text.position === 'bottom' && 'bottom-4'
                )}
              >
                {editData.text.content}
              </div>
            )}
            
            {/* Filter effects overlay */}
            {(editData.filters?.brightness !== 0 || 
              editData.filters?.contrast !== 0 || 
              editData.filters?.saturation !== 0) && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  filter: `brightness(${100 + (editData.filters?.brightness || 0)}%) 
                           contrast(${100 + (editData.filters?.contrast || 0)}%) 
                           saturate(${100 + (editData.filters?.saturation || 0)}%)`
                }}
              />
            )}
          </Card>
          
          {/* Playback overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button
              onClick={onPlayPause}
              size="lg"
              className="h-16 w-16 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 border-2 border-white/20"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Preview info */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-surface/80 backdrop-blur-sm rounded px-2 py-1">
          Resolution: 1920x1080 • {editData.crop || '16:9'} • {previewZoom}%
        </div>
      </div>
      
      {/* Audio Controls */}
      <div className="h-12 bg-surface/50 border-t border-border/30 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex items-center gap-2 min-w-32">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setVolume(value[0]);
                if (value[0] > 0) setIsMuted(false);
              }}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>
        
        {editData.music && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Playing: {editData.music}</span>
          </div>
        )}
      </div>
    </div>
  );
}