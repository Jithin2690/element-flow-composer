
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { PageElement } from '@/types/builder';
import ElementRenderer from './ElementRenderer';

interface DraggableElementProps {
  element: PageElement;
  index: number;
  sectionId: string;
  onUpdate: (updates: any) => void;
  onRemove: () => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
  canFitInRow: (element: PageElement, targetIndex: number) => boolean;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  index,
  sectionId,
  onUpdate,
  onRemove,
  onMoveElement,
  canFitInRow
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'section-element',
    item: { elementIndex: index, sectionId, element },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'section-element',
    hover: (item: { elementIndex: number; sectionId: string; element: PageElement }) => {
      if (!ref.current) return;
      
      const dragIndex = item.elementIndex;
      const hoverIndex = index;

      if (dragIndex === hoverIndex || item.sectionId !== sectionId) return;

      // Check if the element can fit at the target position
      if (!canFitInRow(item.element, hoverIndex)) {
        return; // Don't allow the move if it doesn't fit
      }

      onMoveElement(dragIndex, hoverIndex);
      item.elementIndex = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'} ${
        isOver ? 'ring-2 ring-primary' : ''
      }`}
    >
      <ElementRenderer
        element={element}
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    </div>
  );
};

export default DraggableElement;
