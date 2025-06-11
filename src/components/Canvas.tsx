
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Plus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageSection, DragItem } from '@/types/builder';
import SectionDropZone from './SectionDropZone';
import PublishDialog from './PublishDialog';

interface CanvasProps {
  sections: PageSection[];
  onAddSection: () => void;
  onAddElement: (sectionId: string, element: any) => void;
  onUpdateElement: (sectionId: string, elementId: string, updates: any) => void;
  onRemoveElement: (sectionId: string, elementId: string) => void;
  onMoveElement: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  sections,
  onAddSection,
  onAddElement,
  onUpdateElement,
  onRemoveElement,
  onMoveElement
}) => {
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Page Builder</h1>
            <p className="text-muted-foreground">Drag elements from the sidebar to build your page</p>
          </div>
          <Button onClick={() => setShowPublishDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Globe className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>

        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Add Your First Section</h3>
              <p className="text-muted-foreground mb-4">Start building your page by adding a section</p>
              <Button onClick={onAddSection} className="bg-primary hover:bg-primary/90">
                Add Section
              </Button>
            </div>
          ) : (
            <>
              {sections.map((section, index) => (
                <SectionDropZone
                  key={section.id}
                  section={section}
                  onAddElement={onAddElement}
                  onUpdateElement={onUpdateElement}
                  onRemoveElement={onRemoveElement}
                  onMoveElement={onMoveElement}
                />
              ))}
              <div className="border border-dashed border-border rounded-lg p-6 text-center">
                <Button onClick={onAddSection} variant="outline" className="border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Section
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <PublishDialog
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        pageData={sections}
      />
    </>
  );
};

export default Canvas;
