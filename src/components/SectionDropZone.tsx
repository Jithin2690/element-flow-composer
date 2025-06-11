
import React from 'react';
import { PageSection } from '@/types/builder';
import { useSectionDropZone } from '@/hooks/useSectionDropZone';
import ElementsGrid from './ElementsGrid';
import MediaUploadDialog from './MediaUploadDialog';

interface SectionDropZoneProps {
  section: PageSection;
  onAddElement: (sectionId: string, element: any) => void;
  onUpdateElement: (sectionId: string, elementId: string, updates: any) => void;
  onRemoveElement: (sectionId: string, elementId: string) => void;
  onMoveElement: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
}

const SectionDropZone: React.FC<SectionDropZoneProps> = ({
  section,
  onAddElement,
  onUpdateElement,
  onRemoveElement,
  onMoveElement
}) => {
  const {
    drop,
    isOver,
    showMediaDialog,
    setShowMediaDialog,
    pendingMediaElement,
    handleMediaUpload
  } = useSectionDropZone({
    sectionId: section.id,
    onAddElement
  });

  const handleElementUpdate = (elementId: string, updates: any) => {
    onUpdateElement(section.id, elementId, updates);
  };

  const handleElementRemove = (elementId: string) => {
    onRemoveElement(section.id, elementId);
  };

  const handleElementMove = (dragIndex: number, hoverIndex: number) => {
    onMoveElement(section.id, dragIndex, hoverIndex);
  };

  return (
    <>
      <div
        ref={drop}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors min-h-[100px] ${
          isOver ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        {section.elements.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Drop elements here to add them to this section</p>
          </div>
        ) : (
          <ElementsGrid
            elements={section.elements}
            sectionId={section.id}
            onUpdateElement={handleElementUpdate}
            onRemoveElement={handleElementRemove}
            onMoveElement={handleElementMove}
          />
        )}
      </div>

      <MediaUploadDialog
        isOpen={showMediaDialog}
        onClose={() => setShowMediaDialog(false)}
        onUpload={handleMediaUpload}
        mediaType={pendingMediaElement?.type}
      />
    </>
  );
};

export default SectionDropZone;
