
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { PageSection, DragItem } from '@/types/builder';
import ElementRenderer from './ElementRenderer';
import MediaUploadDialog from './MediaUploadDialog';

interface SectionDropZoneProps {
  section: PageSection;
  onAddElement: (sectionId: string, element: any) => void;
  onUpdateElement: (sectionId: string, elementId: string, updates: any) => void;
  onRemoveElement: (sectionId: string, elementId: string) => void;
}

const SectionDropZone: React.FC<SectionDropZoneProps> = ({
  section,
  onAddElement,
  onUpdateElement,
  onRemoveElement
}) => {
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [pendingMediaElement, setPendingMediaElement] = useState<any>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'element',
    drop: (item: DragItem) => {
      const newElement = {
        type: item.elementType,
        content: getDefaultContent(item.elementType)
      };

      if (item.elementType === 'image' || item.elementType === 'video') {
        setPendingMediaElement(newElement);
        setShowMediaDialog(true);
      } else {
        onAddElement(section.id, newElement);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Click to edit this text', fontSize: '16px', fontWeight: 'normal' };
      case 'image':
        return { src: '', alt: 'Image', width: '100%' };
      case 'video':
        return { src: '', width: '100%' };
      case 'table':
        return { 
          headers: ['Column 1', 'Column 2'], 
          rows: [['Row 1 Col 1', 'Row 1 Col 2'], ['Row 2 Col 1', 'Row 2 Col 2']] 
        };
      case 'faq':
        return { 
          items: [
            { question: 'Question 1?', answer: 'Answer 1' },
            { question: 'Question 2?', answer: 'Answer 2' }
          ] 
        };
      case 'checklist':
        return { 
          items: [
            { text: 'Item 1', checked: false },
            { text: 'Item 2', checked: true }
          ] 
        };
      case 'divider':
        return { style: 'solid', color: '#e5e7eb', thickness: '1px' };
      default:
        return {};
    }
  };

  const handleMediaUpload = (mediaData: { src: string; uploadType: 'url' | 'file' }) => {
    if (pendingMediaElement) {
      const elementWithMedia = {
        ...pendingMediaElement,
        content: { ...pendingMediaElement.content, src: mediaData.src }
      };
      onAddElement(section.id, elementWithMedia);
      setPendingMediaElement(null);
    }
    setShowMediaDialog(false);
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
          <div className="space-y-4">
            {section.elements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                onUpdate={(updates) => onUpdateElement(section.id, element.id, updates)}
                onRemove={() => onRemoveElement(section.id, element.id)}
              />
            ))}
          </div>
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
