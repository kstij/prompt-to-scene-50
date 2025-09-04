import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Scissors,
  Crop,
  Type,
  Music,
  Palette,
  Upload,
  Wand2,
  Filter,
  Sparkles,
  ImageIcon,
  VideoIcon,
  FileAudio,
  Layers,
  Plus,
  Star,
  Circle,
  Square,
  Triangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoEditData } from "../ChatInterface";

interface ToolsPanelProps {
  editData: VideoEditData;
  onDataChange: (data: Partial<VideoEditData>) => void;
}

const cropPresets = [
  { id: "16:9", name: "16:9 Landscape", icon: "📺" },
  { id: "9:16", name: "9:16 Portrait", icon: "📱" },
  { id: "1:1", name: "1:1 Square", icon: "⬜" },
  { id: "4:3", name: "4:3 Standard", icon: "🖥️" }
];

const musicTracks = [
  { name: "Ambient Chill", genre: "Ambient", duration: "2:34" },
  { name: "Cinematic Epic", genre: "Cinematic", duration: "3:45" },
  { name: "Corporate", genre: "Business", duration: "2:12" },
  { name: "Upbeat Pop", genre: "Pop", duration: "3:22" },
  { name: "Electronic Beat", genre: "Electronic", duration: "2:58" }
];

const filterPresets = [
  { name: "None", preview: "⚪" },
  { name: "Vintage", preview: "🟤" },
  { name: "Black & White", preview: "⚫" },
  { name: "Warm", preview: "🟠" },
  { name: "Cool", preview: "🔵" },
  { name: "Dramatic", preview: "🟣" }
];

const aiTools = [
  { name: "Auto Enhance", icon: Wand2, description: "AI-powered video enhancement" },
  { name: "Smart Crop", icon: Crop, description: "Intelligent cropping suggestions" },
  { name: "Auto Captions", icon: Type, description: "Generate captions automatically" },
  { name: "Scene Detection", icon: Scissors, description: "Detect and split scenes" }
];

export function ToolsPanel({ editData, onDataChange }: ToolsPanelProps) {
  const [activeSection, setActiveSection] = useState<string | null>("basic");
  
  const updateEditData = (updates: Partial<VideoEditData>) => {
    onDataChange(updates);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* AI Tools Section */}
        <Card className="p-4 bg-gradient-primary/10 border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">AI Tools</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {aiTools.map((tool) => (
              <Button
                key={tool.name}
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col items-center gap-1 hover:bg-primary/10"
              >
                <tool.icon className="h-4 w-4" />
                <span className="text-xs text-center leading-tight">{tool.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Basic Tools */}
        <Card className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection("basic")}
          >
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span className="font-medium">Basic Tools</span>
            </div>
            <span className={cn("transition-transform", activeSection === "basic" && "rotate-180")}>
              ▼
            </span>
          </Button>
          
          {activeSection === "basic" && (
            <div className="p-4 pt-0 space-y-4">
              {/* Crop */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Aspect Ratio</Label>
                <div className="grid grid-cols-2 gap-2">
                  {cropPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant={editData.crop === preset.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateEditData({ crop: preset.id })}
                      className="h-auto p-2 flex flex-col items-center gap-1"
                    >
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Trim */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Trim Video</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-12">Start:</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={editData.trim?.start || 0}
                      onChange={(e) => updateEditData({
                        trim: { ...editData.trim, start: parseFloat(e.target.value) || 0, end: editData.trim?.end || 15 }
                      })}
                      className="h-7 text-xs"
                      step="0.1"
                      min="0"
                      max="30"
                    />
                    <span className="text-xs text-muted-foreground">s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-12">End:</Label>
                    <Input
                      type="number"
                      placeholder="15"
                      value={editData.trim?.end || 15}
                      onChange={(e) => updateEditData({
                        trim: { start: editData.trim?.start || 0, end: parseFloat(e.target.value) || 15 }
                      })}
                      className="h-7 text-xs"
                      step="0.1"
                      min="0"
                      max="30"
                    />
                    <span className="text-xs text-muted-foreground">s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Text & Graphics */}
        <Card className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection("text")}
          >
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="font-medium">Text & Graphics</span>
            </div>
            <span className={cn("transition-transform", activeSection === "text" && "rotate-180")}>
              ▼
            </span>
          </Button>
          
          {activeSection === "text" && (
            <div className="p-4 pt-0 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Add Text</Label>
                <Input
                  placeholder="Enter your text..."
                  value={editData.text?.content || ""}
                  onChange={(e) => updateEditData({
                    text: { ...editData.text, content: e.target.value, position: editData.text?.position || "bottom" }
                  })}
                  className="h-8 text-sm"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Position</Label>
                <Select 
                  value={editData.text?.position || "bottom"}
                  onValueChange={(value) => updateEditData({
                    text: { content: editData.text?.content || "", position: value }
                  })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">Shapes</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Circle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Triangle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Audio */}
        <Card className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection("audio")}
          >
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="font-medium">Audio</span>
            </div>
            <span className={cn("transition-transform", activeSection === "audio" && "rotate-180")}>
              ▼
            </span>
          </Button>
          
          {activeSection === "audio" && (
            <div className="p-4 pt-0 space-y-4">
              <Button variant="outline" className="w-full justify-start h-8">
                <Upload className="h-3 w-3 mr-2" />
                <span className="text-sm">Upload Audio</span>
              </Button>

              <div>
                <Label className="text-sm font-medium mb-2 block">Stock Music</Label>
                <div className="space-y-1">
                  {musicTracks.map((track) => (
                    <Button
                      key={track.name}
                      variant={editData.music === track.name ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updateEditData({ music: track.name })}
                      className="w-full justify-start h-auto p-2"
                    >
                      <div className="text-left">
                        <div className="text-xs font-medium">{track.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {track.genre} • {track.duration}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Effects & Filters */}
        <Card className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection("effects")}
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="font-medium">Effects & Filters</span>
            </div>
            <span className={cn("transition-transform", activeSection === "effects" && "rotate-180")}>
              ▼
            </span>
          </Button>
          
          {activeSection === "effects" && (
            <div className="p-4 pt-0 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Filter Presets</Label>
                <div className="grid grid-cols-3 gap-2">
                  {filterPresets.map((filter) => (
                    <Button
                      key={filter.name}
                      variant="outline"
                      size="sm"
                      className="h-auto p-2 flex flex-col items-center gap-1"
                    >
                      <span className="text-lg">{filter.preview}</span>
                      <span className="text-xs">{filter.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Adjustments</Label>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Wand2 className="h-3 w-3 mr-2" />
                    Auto Color Correct
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Star className="h-3 w-3 mr-2" />
                    Add Glow Effect
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Filter className="h-3 w-3 mr-2" />
                    Vintage Look
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Media Library */}
        <Card className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection("media")}
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="font-medium">Media Library</span>
            </div>
            <span className={cn("transition-transform", activeSection === "media" && "rotate-180")}>
              ▼
            </span>
          </Button>
          
          {activeSection === "media" && (
            <div className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                  <VideoIcon className="h-4 w-4" />
                  <span className="text-xs">Videos</span>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-xs">Images</span>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                  <FileAudio className="h-4 w-4" />
                  <span className="text-xs">Audio</span>
                </Button>
              </div>
              
              <Button variant="outline" className="w-full h-16 border-2 border-dashed">
                <div className="text-center">
                  <Plus className="h-4 w-4 mx-auto mb-1" />
                  <span className="text-xs">Drop files here</span>
                </div>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </ScrollArea>
  );
}