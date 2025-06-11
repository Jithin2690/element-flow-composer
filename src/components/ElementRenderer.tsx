import React, { useState } from 'react';
import { X, Edit3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { PageElement } from '@/types/builder';

interface ElementRendererProps {
  element: PageElement;
  onUpdate: (updates: any) => void;
  onRemove: () => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleContentChange = (newContent: any) => {
    onUpdate({ content: newContent });
  };

  const handleWidthChange = (newWidth: number[]) => {
    onUpdate({ width: newWidth[0] });
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={element.content.text}
              onChange={(e) => handleContentChange({ ...element.content, text: e.target.value })}
              placeholder="Enter your text..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setIsEditing(false)}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div 
            className="p-4 border border-dashed border-muted-foreground/30 rounded cursor-pointer hover:bg-accent/50"
            onClick={() => setIsEditing(true)}
          >
            <p style={{ fontSize: element.content.fontSize, fontWeight: element.content.fontWeight }}>
              {element.content.text}
            </p>
          </div>
        );

      case 'image':
        return element.content.src ? (
          <div className="relative">
            <img 
              src={element.content.src} 
              alt={element.content.alt}
              className="max-w-full h-auto rounded"
              style={{ width: element.content.width }}
            />
          </div>
        ) : (
          <div className="border border-dashed border-muted-foreground/30 rounded p-8 text-center">
            <p className="text-muted-foreground">No image selected</p>
          </div>
        );

      case 'video':
        return element.content.src ? (
          <div className="relative">
            <video 
              src={element.content.src}
              controls
              className="max-w-full h-auto rounded"
              style={{ width: element.content.width }}
            />
          </div>
        ) : (
          <div className="border border-dashed border-muted-foreground/30 rounded p-8 text-center">
            <p className="text-muted-foreground">No video selected</p>
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr>
                  {element.content.headers.map((header: string, i: number) => (
                    <th key={i} className="border border-border p-2 bg-muted font-medium text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {element.content.rows.map((row: string[], i: number) => (
                  <tr key={i}>
                    {row.map((cell: string, j: number) => (
                      <td key={j} className="border border-border p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            {element.content.items.map((item: any, i: number) => (
              <div key={i} className="border border-border rounded-lg">
                <div className="p-4 font-medium bg-muted/50">
                  {item.question}
                </div>
                <div className="p-4">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        );

      case 'checklist':
        return (
          <div className="space-y-2">
            {element.content.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  readOnly
                  className="rounded"
                />
                <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        );

      case 'divider':
        return (
          <hr 
            style={{ 
              borderColor: element.content.color,
              borderWidth: element.content.thickness,
              borderStyle: element.content.style
            }}
            className="my-4"
          />
        );

      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div className="group relative border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowSettings(!showSettings)}
          className="h-8 w-8 p-0"
        >
          <Settings className="h-3 w-3" />
        </Button>
        {element.type === 'text' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onRemove}
          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {showSettings && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Width: {element.width}%</label>
              <Slider
                value={[element.width]}
                onValueChange={handleWidthChange}
                min={25}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
      
      {renderElement()}
    </div>
  );
};

export default ElementRenderer;
