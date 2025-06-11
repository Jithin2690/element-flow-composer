
import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { PageSection, PageElement, DragItem } from '@/types/builder';
import DraggableElement from './DraggableElement';
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
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [pendingMediaElement, setPendingMediaElement] = useState<any>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'element',
    drop: (item: DragItem) => {
      const newElement = {
        type: item.elementType,
        content: getDefaultContent(item.elementType),
        width: 100 // Default to full width
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

  const handleMoveElement = useCallback((dragIndex: number, hoverIndex: number) => {
    console.log('Moving element from', dragIndex, 'to', hoverIndex);
    onMoveElement(section.id, dragIndex, hoverIndex);
  }, [section.id, onMoveElement]);

  // Calculate available space at a given position considering row layout
  const getAvailableSpaceAt = useCallback((targetIndex: number, excludeIndex?: number): number => {
    // Filter out the excluded element if specified
    const filteredElements = excludeIndex !== undefined 
      ? section.elements.filter((_, idx) => idx !== excludeIndex)
      : section.elements;

    // If targetIndex is at the end, calculate space in the last row
    if (targetIndex >= filteredElements.length) {
      // Find the last row's total width
      let lastRowWidth = 0;
      let currentRowWidth = 0;
      
      for (const element of filteredElements) {
        if (currentRowWidth + element.width <= 100) {
          currentRowWidth += element.width;
        } else {
          lastRowWidth = currentRowWidth;
          currentRowWidth = element.width;
        }
      }
      
      return 100 - currentRowWidth;
    }

    // Calculate which row the target position is in and available space
    let currentRowWidth = 0;
    let elementsInCurrentRow: PageElement[] = [];
    
    for (let i = 0; i <= targetIndex && i < filteredElements.length; i++) {
      const element = filteredElements[i];
      
      if (currentRowWidth + element.width <= 100) {
        currentRowWidth += element.width;
        elementsInCurrentRow.push(element);
      } else {
        // This element starts a new row
        if (i === targetIndex) {
          // Target is at the start of a new row, so previous row space doesn't matter
          return 100;
        }
        // Reset for new row
        currentRowWidth = element.width;
        elementsInCurrentRow = [element];
      }
    }
    
    return 100 - currentRowWidth;
  }, [section.elements]);

  // Group elements into rows for rendering
  const getElementRows = () => {
    const rows: { elements: PageElement[]; indices: number[] }[] = [];
    let currentRow: PageElement[] = [];
    let currentRowIndices: number[] = [];
    let currentRowWidth = 0;

    section.elements.forEach((element, index) => {
      if (currentRowWidth + element.width <= 100) {
        currentRow.push(element);
        currentRowIndices.push(index);
        currentRowWidth += element.width;
      } else {
        if (currentRow.length > 0) {
          rows.push({ elements: currentRow, indices: currentRowIndices });
        }
        currentRow = [element];
        currentRowIndices = [index];
        currentRowWidth = element.width;
      }
    });

    if (currentRow.length > 0) {
      rows.push({ elements: currentRow, indices: currentRowIndices });
    }

    return rows;
  };

  // Render elements in rows
  const renderElements = () => {
    const rows = getElementRows();
    
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 mb-4">
        {row.elements.map((element, elementIndex) => {
          const actualIndex = row.indices[elementIndex];
          return (
            <div key={element.id} style={{ width: `${element.width}%` }}>
              <DraggableElement
                element={element}
                index={actualIndex}
                sectionId={section.id}
                onUpdate={(updates) => onUpdateElement(section.id, element.id, updates)}
                onRemove={() => onRemoveElement(section.id, element.id)}
                onMoveElement={handleMoveElement}
                getAvailableSpaceAt={getAvailableSpaceAt}
              />
            </div>
          );
        })}
      </div>
    ));
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
          <div>
            {renderElements()}
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
