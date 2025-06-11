
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
  getAvailableSpaceAt: (targetIndex: number, excludeIndex?: number) => number;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  index,
  sectionId,
  onUpdate,
  onRemove,
  onMoveElement,
  getAvailableSpaceAt
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'section-element',
    item: { elementIndex: index, sectionId, element },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'section-element',
    hover: (item: { elementIndex: number; sectionId: string; element: PageElement }) => {
      if (!ref.current) return;
      
      const dragIndex = item.elementIndex;
      const hoverIndex = index;

      // Don't replace items with themselves or from different sections
      if (dragIndex === hoverIndex || item.sectionId !== sectionId) return;

      // Check if there's enough space at the target position
      const availableSpace = getAvailableSpaceAt(hoverIndex, dragIndex);
      if (item.element.width > availableSpace) {
        return; // Don't allow the move if it doesn't fit
      }

      onMoveElement(dragIndex, hoverIndex);
      item.elementIndex = hoverIndex;
    },
    canDrop: (item: { elementIndex: number; sectionId: string; element: PageElement }) => {
      if (item.sectionId !== sectionId) return false;
      const availableSpace = getAvailableSpaceAt(index, item.elementIndex);
      return item.element.width <= availableSpace;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'} ${
        isOver && canDrop ? 'ring-2 ring-primary shadow-lg' : ''
      } ${isOver && !canDrop ? 'ring-2 ring-destructive' : ''}`}
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
