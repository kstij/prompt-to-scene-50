import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomApiConfig {
  name: string;
  apiKey: string;
  endpoint: string;
  description?: string;
}

interface CustomApiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: CustomApiConfig) => void;
  initialConfig?: CustomApiConfig;
}

export function CustomApiDialog({ open, onOpenChange, onSave, initialConfig }: CustomApiDialogProps) {
  const [config, setConfig] = useState<CustomApiConfig>(
    initialConfig || {
      name: "",
      apiKey: "",
      endpoint: "",
      description: ""
    }
  );

  const handleSave = () => {
    if (config.name && config.apiKey && config.endpoint) {
      onSave(config);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setConfig(initialConfig || {
      name: "",
      apiKey: "",
      endpoint: "",
      description: ""
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border z-50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Configure Custom API</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Model Name</Label>
            <Input
              id="name"
              placeholder="e.g., My Custom Model"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="bg-surface border-border text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-foreground">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Your API key"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="bg-surface border-border text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endpoint" className="text-foreground">API Endpoint</Label>
            <Input
              id="endpoint"
              placeholder="https://api.example.com/v1/generate"
              value={config.endpoint}
              onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
              className="bg-surface border-border text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your model"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="bg-surface border-border text-foreground resize-none h-20"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!config.name || !config.apiKey || !config.endpoint}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}