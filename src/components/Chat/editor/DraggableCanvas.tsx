import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricText, Rect, Circle } from "fabric";
import { Button } from "@/components/ui/button";
import { Type, Square, Circle as CircleIcon, Trash2 } from "lucide-react";
import type { VideoEditData } from "../ChatInterface";

interface DraggableCanvasProps {
  editData: VideoEditData;
  onDataChange: (data: Partial<VideoEditData>) => void;
  onElementSelect: (elementId: string | null) => void;
  selectedElement: string | null;
  width: number;
  height: number;
}

interface CanvasElement {
  id: string;
  type: 'text' | 'shape';
  data: any;
}

export function DraggableCanvas({ 
  editData, 
  onDataChange, 
  onElementSelect,
  selectedElement,
  width, 
  height 
}: DraggableCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true
    });

    // Handle object selection
    canvas.on('selection:created', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject && (activeObject as any).customId) {
        onElementSelect((activeObject as any).customId);
      }
    });

    canvas.on('selection:updated', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject && (activeObject as any).customId) {
        onElementSelect((activeObject as any).customId);
      }
    });

    canvas.on('selection:cleared', () => {
      onElementSelect(null);
    });

    // Handle object modifications
    canvas.on('object:modified', (e) => {
      const obj = e.target;
      if (obj && (obj as any).customId) {
        updateElementData((obj as any).customId, {
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle
        });
      }
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  const updateElementData = (elementId: string, updates: any) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, data: { ...el.data, ...updates } }
        : el
    ));
  };

  const addText = () => {
    if (!fabricCanvas) return;

    const textId = `text-${Date.now()}`;
    const textObj = new FabricText(editData.text?.content || 'Double click to edit', {
      left: fabricCanvas.width! / 2 - 75,
      top: fabricCanvas.height! / 2 - 10,
      fontSize: 24,
      fontFamily: 'Inter',
      fill: '#ffffff',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeWidth: 2,
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });

    // Add custom properties
    (textObj as any).customId = textId;
    (textObj as any).elementType = 'text';

    // Simplified text editing - just handle modifications
    textObj.on('modified', () => {
      // Update edit data when text is moved
      onDataChange({
        text: {
          content: textObj.text || '',
          position: 'custom',
          fontSize: textObj.fontSize,
          fontFamily: textObj.fontFamily,
          color: textObj.fill as string,
          x: textObj.left,
          y: textObj.top
        }
      });
    });

    // Make text selectable for dragging
    textObj.selectable = true;

    fabricCanvas.add(textObj);
    fabricCanvas.setActiveObject(textObj);
    fabricCanvas.renderAll();

    const newElement: CanvasElement = {
      id: textId,
      type: 'text',
      data: {
        content: textObj.text,
        left: textObj.left,
        top: textObj.top,
        fontSize: textObj.fontSize,
        fontFamily: textObj.fontFamily,
        fill: textObj.fill
      }
    };

    setElements(prev => [...prev, newElement]);
    onElementSelect(textId);
  };

  const addShape = (shapeType: 'rectangle' | 'circle') => {
    if (!fabricCanvas) return;

    let shape;
    const shapeId = `${shapeType}-${Date.now()}`;

    if (shapeType === 'rectangle') {
      shape = new Rect({
        left: fabricCanvas.width! / 2 - 50,
        top: fabricCanvas.height! / 2 - 25,
        fill: '#3b82f6',
        width: 100,
        height: 50,
        stroke: '#1e40af',
        strokeWidth: 2,
        rx: 10,
        ry: 10
      });
    } else {
      shape = new Circle({
        left: fabricCanvas.width! / 2 - 50,
        top: fabricCanvas.height! / 2 - 50,
        fill: '#3b82f6',
        radius: 50,
        stroke: '#1e40af',
        strokeWidth: 2
      });
    }

    // Add custom properties
    (shape as any).customId = shapeId;
    (shape as any).elementType = 'shape';

    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();

    const newElement: CanvasElement = {
      id: shapeId,
      type: 'shape',
      data: {
        shapeType,
        left: shape.left,
        top: shape.top,
        fill: shape.fill
      }
    };

    setElements(prev => [...prev, newElement]);
    onElementSelect(shapeId);
  };

  const deleteSelectedElement = () => {
    if (!fabricCanvas || !selectedElement) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
    }

    setElements(prev => prev.filter(el => el.id !== selectedElement));
    onElementSelect(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ 
          pointerEvents: fabricCanvas ? 'auto' : 'none',
          zIndex: 10 
        }}
      />

      {/* Floating Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex gap-2 bg-surface/90 backdrop-blur-sm rounded-lg p-2 border border-border/50">
        <Button
          variant="outline"
          size="sm"
          onClick={addText}
          className="h-8 w-8 p-0"
          title="Add Text"
        >
          <Type className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => addShape('rectangle')}
          className="h-8 w-8 p-0"
          title="Add Rectangle"
        >
          <Square className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => addShape('circle')}
          className="h-8 w-8 p-0"
          title="Add Circle"
        >
          <CircleIcon className="h-4 w-4" />
        </Button>

        {selectedElement && (
          <Button
            variant="outline"
            size="sm"
            onClick={deleteSelectedElement}
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
            title="Delete Selected"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm">
        Click and drag to move elements • Double-click text to edit
      </div>
    </div>
  );
}