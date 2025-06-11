
import React, { useState } from 'react';
import { X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { PageElement } from '@/types/builder';
import ElementContent from './ElementContent';

interface ElementRendererProps {
  element: PageElement;
  onUpdate: (updates: any) => void;
  onRemove: () => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (newContent: any) => {
    onUpdate({ content: newContent });
  };

  const handleResize = (size: number) => {
    onUpdate({ width: Math.round(size) });
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[60px]">
      <ResizablePanel 
        defaultSize={element.width} 
        minSize={10}
        maxSize={100}
        onResize={handleResize}
      >
        <div className="group relative border border-border rounded-lg p-4 hover:border-primary/50 transition-colors h-full">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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
          
          <ElementContent
            element={element}
            isEditing={isEditing}
            onContentChange={handleContentChange}
            onEditingChange={setIsEditing}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={100 - element.width} />
    </ResizablePanelGroup>
  );
};

export default ElementRenderer;
