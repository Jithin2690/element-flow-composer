
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

      // Only move if it's a valid drop position
      const rect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (rect.bottom - rect.top) / 2;
      const clientOffset = { x: 0, y: 0 }; // We'll handle this more simply
      
      // For now, just allow the move - validation will happen on drop
      onMoveElement(dragIndex, hoverIndex);
      item.elementIndex = hoverIndex;
    },
    drop: (item: { elementIndex: number; sectionId: string; element: PageElement }) => {
      // This is where the final drop validation happens
      console.log('Drop attempted at index:', index);
      return { dropped: true };
    },
    canDrop: (item: { elementIndex: number; sectionId: string; element: PageElement }) => {
      if (item.sectionId !== sectionId) return false;
      // Always allow drops for now - we'll handle space checking differently
      return true;
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
        isOver && canDrop ? 'ring-2 ring-green-500 shadow-lg' : ''
      } ${isOver && !canDrop ? 'ring-2 ring-red-500' : ''}`}
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
