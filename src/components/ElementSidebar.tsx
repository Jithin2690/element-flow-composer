
import React from 'react';
import { useDrag } from 'react-dnd';
import { Type, Image, Video, Table, HelpCircle, CheckSquare, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const elements = [
  { type: 'text', label: 'Text', icon: Type, description: 'Add text content' },
  { type: 'image', label: 'Image', icon: Image, description: 'Add images' },
  { type: 'video', label: 'Video', icon: Video, description: 'Embed videos' },
  { type: 'table', label: 'Table', icon: Table, description: 'Data tables' },
  { type: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Q&A sections' },
  { type: 'checklist', label: 'Checklist', icon: CheckSquare, description: 'Task lists' },
  { type: 'divider', label: 'Divider', icon: Minus, description: 'Section dividers' }
];

const DraggableElement: React.FC<{ element: any }> = ({ element }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { elementType: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const Icon = element.icon;

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move hover:bg-accent transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium text-sm">{element.label}</p>
          <p className="text-xs text-muted-foreground">{element.description}</p>
        </div>
      </div>
    </div>
  );
};

const ElementSidebar = () => {
  return (
    <div className="w-80 border-l bg-card p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Elements</h2>
        <p className="text-sm text-muted-foreground">Drag elements to add them to your page</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {elements.map((element) => (
              <DraggableElement key={element.type} element={element} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Layout Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ElementSidebar;
