import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  X, 
  Scissors, 
  Crop, 
  Type, 
  Music, 
  Palette, 
  Save,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [activeTab, setActiveTab] = useState("trim");
  
  const updateEditData = (updates: Partial<VideoEditData>) => {
    const newData = { ...editData, ...updates };
    onDataChange(newData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
      <div className="w-full bg-surface border-t border-border rounded-t-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Scissors className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold">Edit Video</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => onSave(editData)} className="bg-gradient-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Edit Tools */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="trim" className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Trim
              </TabsTrigger>
              <TabsTrigger value="crop" className="flex items-center gap-2">
                <Crop className="h-4 w-4" />
                Crop
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Music
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Filters
              </TabsTrigger>
            </TabsList>

            {/* Trim Tab */}
            <TabsContent value="trim" className="space-y-6">
              <Card className="p-4 bg-card border-border/50">
                <h3 className="font-medium mb-4">Trim Timeline</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Start Time (seconds)</Label>
                    <Slider
                      value={[editData.trim?.start || 0]}
                      max={30}
                      step={0.1}
                      onValueChange={(value) => updateEditData({ 
                        trim: { ...editData.trim, start: value[0], end: editData.trim?.end || 15 }
                      })}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {(editData.trim?.start || 0).toFixed(1)}s
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">End Time (seconds)</Label>
                    <Slider
                      value={[editData.trim?.end || 15]}
                      max={30}
                      step={0.1}
                      onValueChange={(value) => updateEditData({ 
                        trim: { start: editData.trim?.start || 0, end: value[0] }
                      })}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {(editData.trim?.end || 15).toFixed(1)}s
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Crop Tab */}
            <TabsContent value="crop" className="space-y-6">
              <Card className="p-4 bg-card border-border/50">
                <h3 className="font-medium mb-4">Aspect Ratio</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {CROP_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant={editData.crop === preset.value ? "default" : "outline"}
                      onClick={() => updateEditData({ crop: preset.value })}
                      className="h-12 justify-start"
                    >
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs opacity-70">{preset.value}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-6">
              <Card className="p-4 bg-card border-border/50">
                <h3 className="font-medium mb-4">Text Overlay</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text-content">Text Content</Label>
                    <Input
                      id="text-content"
                      placeholder="Enter your text..."
                      value={editData.text?.content || ""}
                      onChange={(e) => updateEditData({ 
                        text: { ...editData.text, content: e.target.value, position: editData.text?.position || "bottom" }
                      })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Position</Label>
                    <Select 
                      value={editData.text?.position || "bottom"} 
                      onValueChange={(value) => updateEditData({ 
                        text: { content: editData.text?.content || "", position: value }
                      })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEXT_POSITIONS.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Music Tab */}
            <TabsContent value="music" className="space-y-6">
              <Card className="p-4 bg-card border-border/50">
                <h3 className="font-medium mb-4">Background Music</h3>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full h-12 justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Audio File
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Or choose from stock music:
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {["Ambient Chill", "Cinematic Epic", "Corporate", "Upbeat Pop"].map((track) => (
                      <Button
                        key={track}
                        variant={editData.music === track ? "default" : "outline"}
                        onClick={() => updateEditData({ music: track })}
                        className="justify-start"
                      >
                        <Music className="h-4 w-4 mr-2" />
                        {track}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Filters Tab */}
            <TabsContent value="filters" className="space-y-6">
              <Card className="p-4 bg-card border-border/50">
                <h3 className="font-medium mb-4">Video Filters</h3>
                
                <div className="space-y-6">
                  {[
                    { key: "brightness", label: "Brightness", min: -100, max: 100, default: 0 },
                    { key: "contrast", label: "Contrast", min: -100, max: 100, default: 0 },
                    { key: "saturation", label: "Saturation", min: -100, max: 100, default: 0 },
                    { key: "sharpness", label: "Sharpness", min: 0, max: 100, default: 50 }
                  ].map((filter) => (
                    <div key={filter.key}>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">{filter.label}</Label>
                        <span className="text-xs text-muted-foreground">
                          {editData.filters?.[filter.key] || filter.default}
                        </span>
                      </div>
                      <Slider
                        value={[editData.filters?.[filter.key] || filter.default]}
                        min={filter.min}
                        max={filter.max}
                        step={1}
                        onValueChange={(value) => updateEditData({ 
                          filters: { ...editData.filters, [filter.key]: value[0] }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}