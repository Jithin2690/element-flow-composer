
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
    hover: (item: { elementIndex: number; sectionId: string; element: PageElement }, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.elementIndex;
      const hoverIndex = index;

      // Don't replace items with themselves or from different sections
      if (dragIndex === hoverIndex || item.sectionId !== sectionId) return;

      const rect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) return;

      const hoverMiddleY = (rect.bottom - rect.top) / 2;
      const hoverClientY = clientOffset.y - rect.top;

      // For vertical repositioning only
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      console.log('Hover move from', dragIndex, 'to', hoverIndex);
      onMoveElement(dragIndex, hoverIndex);
      item.elementIndex = hoverIndex;
    },
    drop: (item: { elementIndex: number; sectionId: string; element: PageElement }, monitor) => {
      if (!ref.current) return;
      
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const rect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (rect.right - rect.left) / 2;
      const hoverClientX = clientOffset.x - rect.left;
      const isHoveringRight = hoverClientX > hoverMiddleX;

      console.log('Drop attempted at index:', index, 'hovering right:', isHoveringRight);
      
      // If hovering on the right side, place element next to this one
      if (isHoveringRight && item.sectionId === sectionId && item.elementIndex !== index) {
        // Always allow the drop - let the layout system handle overflow
        onMoveElement(item.elementIndex, index + 1);
        console.log('Placed element side-by-side at position', index + 1);
      }
      
      return { dropped: true };
    },
    canDrop: (item: { elementIndex: number; sectionId: string; element: PageElement }) => {
      return item.sectionId === sectionId;
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
      className={`transition-all duration-200 ${isDragging ? 'opacity-30' : 'opacity-100'} ${
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
