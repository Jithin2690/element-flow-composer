
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
    drop: (item: { elementIndex: number; sectionId: string; element: PageElement }, monitor) => {
      if (!monitor.didDrop()) {
        const dragIndex = item.elementIndex;
        const hoverIndex = elements.length;
        
        if (dragIndex !== hoverIndex && item.sectionId === sectionId) {
          // Only allow drop if element can fit in a new row
          if (item.element.width <= 100) {
            onMoveElement(sectionId, dragIndex, hoverIndex);
          }
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

  const getAvailableSpaceAt = (targetIndex: number, excludeIndex?: number): number => {
    // Filter out the excluded element if specified
    const filteredElements = elements.filter((_, idx) => idx !== excludeIndex);
    
    // Calculate which row the target index would be in and available space
    let currentRowWidth = 0;
    let elementsProcessed = 0;
    
    for (let i = 0; i < filteredElements.length && elementsProcessed < targetIndex; i++) {
      const element = filteredElements[i];
      if (currentRowWidth + element.width <= 100) {
        currentRowWidth += element.width;
        elementsProcessed++;
      } else {
        // Start new row
        currentRowWidth = element.width;
        elementsProcessed = 1;
      }
    }
    
    return 100 - currentRowWidth;
  };

  return {
    drop,
    isOver,
    calculateAvailableSpace,
    canElementFitInRow,
    getElementRows,
    getAvailableSpaceAt
  };
};
