import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X, 
  Save,
  Play,
  Pause,
  Volume2,
  Maximize,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Layers,
  Settings,
  Download,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  RotateCcw,
  Move3D,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Timeline } from "./editor/Timeline";
import { PreviewPanel } from "./editor/PreviewPanel";
import { PropertiesPanel } from "./editor/PropertiesPanel";
import { ToolsPanel } from "./editor/ToolsPanel";
import type { VideoEditData } from "./ChatInterface";

interface EditPanelProps {
  videoId: string;
  editData: VideoEditData;
  onSave: (data: VideoEditData) => void;
  onCancel: () => void;
  onDataChange: (data: VideoEditData) => void;
}

const CROP_PRESETS = [
  { id: "16:9", name: "16:9 (Landscape)", value: "16:9" },
  { id: "9:16", name: "9:16 (Portrait)", value: "9:16" },
  { id: "1:1", name: "1:1 (Square)", value: "1:1" },
  { id: "4:3", name: "4:3 (Standard)", value: "4:3" }
];

const TEXT_POSITIONS = [
  { id: "top", name: "Top" },
  { id: "center", name: "Center" },
  { id: "bottom", name: "Bottom" }
];

export function EditPanel({ videoId, editData, onSave, onCancel, onDataChange }: EditPanelProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  
  const updateEditData = (updates: Partial<VideoEditData>) => {
    const newData = { ...editData, ...updates };
    onDataChange(newData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl">
      {/* Professional Video Editor Interface */}
      <div className="h-full flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-surface border-b border-border/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center animate-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold glow-text">AI Video Editor</h2>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[50px] text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="professional-button">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => onSave(editData)} className="bg-gradient-primary professional-button">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Main Editor Layout */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Tools */}
          <div className="w-80 editor-panel">
            <ToolsPanel editData={editData} onDataChange={updateEditData} />
          </div>
          
          {/* Center - Preview & Timeline */}
          <div className="flex-1 flex flex-col bg-gradient-editor">
            {/* Preview Area */}
            <div className="flex-1 video-editor-surface">
              <PreviewPanel 
                videoId={videoId}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onTimeChange={setCurrentTime}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                editData={editData}
                onEditDataChange={updateEditData}
                onElementSelect={setSelectedElement}
                selectedElement={selectedElement}
              />
            </div>
            
            {/* Timeline Area */}
            <div className="h-64 timeline-track border-t border-border/50">
              <Timeline 
                editData={editData}
                currentTime={currentTime}
                onCurrentTimeChange={setCurrentTime}
                onDataChange={updateEditData}
                selectedLayer={selectedLayer}
                onLayerSelect={setSelectedLayer}
                zoom={zoom}
              />
            </div>
          </div>
          
          {/* Right Sidebar - Properties */}
          <div className="w-80 editor-panel">
            <PropertiesPanel 
              editData={editData}
              selectedLayer={selectedElement || selectedLayer}
              onDataChange={updateEditData}
            />
          </div>
        </div>
        
        {/* Bottom Playback Controls */}
        <div className="h-16 bg-surface border-t border-border/50 flex items-center justify-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10 p-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <div className="text-sm text-muted-foreground font-mono">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')} / 0:30.0
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Volume2 className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}