
import React, { useCallback } from 'react';
import { PageElement } from '@/types/builder';
import DraggableElement from './DraggableElement';

interface ElementsGridProps {
  elements: PageElement[];
  sectionId: string;
  onUpdateElement: (elementId: string, updates: any) => void;
  onRemoveElement: (elementId: string) => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
}

const ElementsGrid: React.FC<ElementsGridProps> = ({
  elements,
  sectionId,
  onUpdateElement,
  onRemoveElement,
  onMoveElement
}) => {
  const handleMoveElement = useCallback((dragIndex: number, hoverIndex: number) => {
    console.log('Moving element from', dragIndex, 'to', hoverIndex);
    onMoveElement(dragIndex, hoverIndex);
  }, [onMoveElement]);

  const getAvailableSpaceAt = useCallback((targetIndex: number, excludeIndex?: number): number => {
    return 100;
  }, []);

  return (
    <div className="space-y-4">
      {elements.map((element, index) => (
        <div key={element.id} className="w-full">
          <DraggableElement
            element={element}
            index={index}
            sectionId={sectionId}
            onUpdate={(updates) => onUpdateElement(element.id, updates)}
            onRemove={() => onRemoveElement(element.id)}
            onMoveElement={handleMoveElement}
            getAvailableSpaceAt={getAvailableSpaceAt}
          />
        </div>
      ))}
    </div>
  );
};

export default ElementsGrid;
