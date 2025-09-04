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
  Settings,
  Palette,
  Type,
  Move3D,
  Layers,
  Volume2,
  Eye,
  Lock,
  RotateCcw,
  Copy,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoEditData } from "../ChatInterface";

interface PropertiesPanelProps {
  editData: VideoEditData;
  selectedLayer: string | null;
  onDataChange: (data: Partial<VideoEditData>) => void;
}

const textFonts = [
  "Inter", "Roboto", "Montserrat", "Poppins", "Oswald", "Playfair Display"
];

const textStyles = [
  { id: "normal", name: "Normal" },
  { id: "bold", name: "Bold" },
  { id: "italic", name: "Italic" },
  { id: "bold-italic", name: "Bold Italic" }
];

const colorPresets = [
  "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
];

export function PropertiesPanel({ editData, selectedLayer, onDataChange }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("transform");
  
  const updateEditData = (updates: Partial<VideoEditData>) => {
    onDataChange(updates);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Properties Header */}
      <div className="h-12 bg-card border-b border-border/50 flex items-center px-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Properties</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {selectedLayer ? (
          <div className="p-4 space-y-6">
            {/* Layer Info */}
            <Card className="p-4 bg-surface/50 border-border/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Selected Layer</h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-sm">Main Video</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>Visible</span>
                  <Lock className="h-3 w-3 ml-2" />
                  <span>Unlocked</span>
                </div>
              </div>
            </Card>
            
            {/* Property Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 h-8">
                <TabsTrigger value="transform" className="text-xs p-1">
                  <Move3D className="h-3 w-3 mr-1" />
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-xs p-1">
                  <Palette className="h-3 w-3 mr-1" />
                </TabsTrigger>
                <TabsTrigger value="text" className="text-xs p-1">
                  <Type className="h-3 w-3 mr-1" />
                </TabsTrigger>
                <TabsTrigger value="audio" className="text-xs p-1">
                  <Volume2 className="h-3 w-3 mr-1" />
                </TabsTrigger>
              </TabsList>
              
              {/* Transform Properties */}
              <TabsContent value="transform" className="space-y-4">
                <Card className="p-4 bg-surface/30">
                  <h4 className="font-medium text-sm mb-3">Position & Scale</h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">X Position</Label>
                        <Input type="number" placeholder="0" className="h-8 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Y Position</Label>
                        <Input type="number" placeholder="0" className="h-8 mt-1" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Width</Label>
                        <Input type="number" placeholder="100" className="h-8 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Height</Label>
                        <Input type="number" placeholder="100" className="h-8 mt-1" />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Rotation</Label>
                      <Slider
                        value={[0]}
                        min={-180}
                        max={180}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">0°</div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Opacity</Label>
                      <Slider
                        value={[100]}
                        min={0}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">100%</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              {/* Effects Properties */}
              <TabsContent value="effects" className="space-y-4">
                <Card className="p-4 bg-surface/30">
                  <h4 className="font-medium text-sm mb-3">Color Adjustments</h4>
                  
                  <div className="space-y-4">
                    {[
                      { key: "brightness", label: "Brightness", min: -100, max: 100, default: editData.filters?.brightness || 0 },
                      { key: "contrast", label: "Contrast", min: -100, max: 100, default: editData.filters?.contrast || 0 },
                      { key: "saturation", label: "Saturation", min: -100, max: 100, default: editData.filters?.saturation || 0 },
                      { key: "hue", label: "Hue", min: -180, max: 180, default: 0 },
                      { key: "sharpness", label: "Sharpness", min: 0, max: 100, default: editData.filters?.sharpness || 50 }
                    ].map((filter) => (
                      <div key={filter.key}>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs">{filter.label}</Label>
                          <span className="text-xs text-muted-foreground">
                            {filter.default}{filter.key === 'hue' ? '°' : '%'}
                          </span>
                        </div>
                        <Slider
                          value={[filter.default]}
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
                
                <Card className="p-4 bg-surface/30">
                  <h4 className="font-medium text-sm mb-3">Blur & Effects</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Blur</Label>
                      <Slider
                        value={[0]}
                        min={0}
                        max={20}
                        step={0.5}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">0px</div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Vignette</Label>
                      <Slider
                        value={[0]}
                        min={0}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">0%</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              {/* Text Properties */}
              <TabsContent value="text" className="space-y-4">
                <Card className="p-4 bg-surface/30">
                  <h4 className="font-medium text-sm mb-3">Text Content</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Content</Label>
                      <Input
                        placeholder="Enter your text..."
                        value={editData.text?.content || ""}
                        onChange={(e) => updateEditData({
                          text: { ...editData.text, content: e.target.value, position: editData.text?.position || "bottom" }
                        })}
                        className="h-8 mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Font Family</Label>
                      <Select defaultValue="Inter">
                        <SelectTrigger className="h-8 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {textFonts.map((font) => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Size</Label>
                        <Input type="number" placeholder="18" className="h-8 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Weight</Label>
                        <Select defaultValue="normal">
                          <SelectTrigger className="h-8 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {textStyles.map((style) => (
                              <SelectItem key={style.id} value={style.id}>
                                {style.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Color</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-1">
                          {colorPresets.map((color) => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded border border-border/50 hover:border-primary transition-colors"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Position</Label>
                      <Select 
                        value={editData.text?.position || "bottom"}
                        onValueChange={(value) => updateEditData({
                          text: { content: editData.text?.content || "", position: value }
                        })}
                      >
                        <SelectTrigger className="h-8 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              {/* Audio Properties */}
              <TabsContent value="audio" className="space-y-4">
                <Card className="p-4 bg-surface/30">
                  <h4 className="font-medium text-sm mb-3">Audio Settings</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Volume</Label>
                      <Slider
                        value={[100]}
                        min={0}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">100%</div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Fade In (s)</Label>
                      <Slider
                        value={[0]}
                        min={0}
                        max={5}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">0.0s</div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Fade Out (s)</Label>
                      <Slider
                        value={[0]}
                        min={0}
                        max={5}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">0.0s</div>
                    </div>
                  </div>
                </Card>
                
                {editData.music && (
                  <Card className="p-4 bg-surface/30">
                    <h4 className="font-medium text-sm mb-3">Background Music</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span>{editData.music}</span>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full h-8">
                        <RotateCcw className="h-3 w-3 mr-2" />
                        Replace Track
                      </Button>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No Layer Selected</h3>
            <p className="text-sm">Select a layer from the timeline to edit its properties</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}