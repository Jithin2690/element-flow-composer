
import { useDrop } from 'react-dnd';
import { PageElement } from '@/types/builder';

interface UseSectionDragDropProps {
  sectionId: string;
  elements: PageElement[];
  onMoveElement: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
}

export const useSectionDragDrop = ({ sectionId, elements, onMoveElement }: UseSectionDragDropProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'section-element',
    drop: (item: { elementIndex: number; sectionId: string }, monitor) => {
      if (!monitor.didDrop()) {
        const dragIndex = item.elementIndex;
        const hoverIndex = elements.length;
        
        if (dragIndex !== hoverIndex && item.sectionId === sectionId) {
          onMoveElement(sectionId, dragIndex, hoverIndex);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });

  const calculateAvailableSpace = (rowElements: PageElement[]): number => {
    return 100 - rowElements.reduce((total, el) => total + el.width, 0);
  };

  const canElementFitInRow = (element: PageElement, rowElements: PageElement[]): boolean => {
    const availableSpace = calculateAvailableSpace(rowElements);
    return element.width <= availableSpace;
  };

  const getElementRows = (): PageElement[][] => {
    const rows: PageElement[][] = [];
    let currentRow: PageElement[] = [];
    let currentRowWidth = 0;

    elements.forEach(element => {
      if (currentRowWidth + element.width <= 100) {
        currentRow.push(element);
        currentRowWidth += element.width;
      } else {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [element];
        currentRowWidth = element.width;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  return {
    drop,
    isOver,
    calculateAvailableSpace,
    canElementFitInRow,
    getElementRows
  };
};
